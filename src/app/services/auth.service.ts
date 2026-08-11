import { isPlatformBrowser } from '@angular/common';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  finalize,
  map,
  of,
  shareReplay,
  takeUntil,
  tap,
} from 'rxjs';
import { environment } from '../../environments/environment';
import {
  IGNORAR_REDIRECIONAMENTO_401,
  IGNORAR_TRATAMENTO_GLOBAL_DE_ERRO,
} from '../core/http/http-context.tokens';

export interface LoginRequest {
  ds_usuario: string;
  ds_senha: string;
}

export interface UsuarioAutenticado {
  seq_usuario: number;
  ds_usuario: string;
  ds_nome: string | null;
  st_ativo?: boolean;
  filiais_gestao: FilialGestaoPermissao[];
}

export interface FilialGestaoPermissao {
  seq_filial: number;
  st_visualiza: boolean;
  st_edita: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_at: string;
  expires_in: number;
  usuario: UsuarioAutenticado;
}

export type EstadoValidacaoSessao = 'autenticada' | 'nao-autenticada' | 'indisponivel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginUrl = `${environment.apiUrl}/auth/login`;
  private readonly usuarioUrl = `${environment.apiUrl}/auth/me`;
  private readonly tokenKey = 'renascer_access_token';
  private readonly usuarioKey = 'renascer_usuario';
  private readonly expiracaoKey = 'renascer_token_expires_at';
  private readonly usuarioSubject = new BehaviorSubject<UsuarioAutenticado | null>(null);
  private readonly sessaoEncerradaSubject = new Subject<void>();
  private atualizacaoUsuarioEmCurso$: Observable<UsuarioAutenticado> | null = null;
  private validacaoSessaoEmCurso$: Observable<EstadoValidacaoSessao> | null = null;
  private tokenConfirmado: string | null = null;
  private ultimaFalhaTemporariaEm = 0;
  private readonly intervaloNovaTentativaMs = 5_000;
  readonly usuarioAtual$ = this.usuarioSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    if (this.temSessaoLocalValida()) {
      this.usuarioSubject.next(this.lerUsuarioArmazenado());
    }
  }

  login(credenciais: LoginRequest): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('username', credenciais.ds_usuario)
      .set('password', credenciais.ds_senha);

    return this.http
      .post<LoginResponse>(this.loginUrl, body.toString(), {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      })
      .pipe(tap((resposta) => this.salvarSessao(resposta)));
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.usuarioKey);
      localStorage.removeItem(this.expiracaoKey);
    }

    this.sessaoEncerradaSubject.next();
    this.atualizacaoUsuarioEmCurso$ = null;
    this.validacaoSessaoEmCurso$ = null;
    this.tokenConfirmado = null;
    this.ultimaFalhaTemporariaEm = 0;
    this.usuarioSubject.next(null);
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      if (
        localStorage.getItem(this.usuarioKey) !== null ||
        localStorage.getItem(this.expiracaoKey) !== null
      ) {
        this.logout();
      }
      return null;
    }

    if (!this.tokenLocalValido(token)) {
      this.logout();
      return null;
    }

    return token;
  }

  getUsuario(): UsuarioAutenticado | null {
    if (!this.temSessaoLocalValida()) {
      return null;
    }

    const usuario = this.lerUsuarioArmazenado();
    if (JSON.stringify(usuario) !== JSON.stringify(this.usuarioSubject.value)) {
      this.usuarioSubject.next(usuario);
    }
    return this.usuarioSubject.value;
  }

  atualizarUsuario(): Observable<UsuarioAutenticado> {
    if (this.atualizacaoUsuarioEmCurso$) {
      return this.atualizacaoUsuarioEmCurso$;
    }

    const atualizacao$ = this.http.get<UsuarioAutenticado>(this.usuarioUrl).pipe(
      takeUntil(this.sessaoEncerradaSubject),
      tap((usuario) => this.salvarUsuario(usuario)),
      finalize(() => (this.atualizacaoUsuarioEmCurso$ = null)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.atualizacaoUsuarioEmCurso$ = atualizacao$;
    return atualizacao$;
  }

  temSessaoLocalValida(): boolean {
    return this.getToken() !== null;
  }

  validarSessao(): Observable<EstadoValidacaoSessao> {
    const token = this.getToken();
    if (!token) {
      return of('nao-autenticada');
    }

    if (this.tokenConfirmado === token) {
      return of('autenticada');
    }

    if (this.validacaoSessaoEmCurso$) {
      return this.validacaoSessaoEmCurso$;
    }

    if (Date.now() - this.ultimaFalhaTemporariaEm < this.intervaloNovaTentativaMs) {
      return of('indisponivel');
    }

    const context = new HttpContext()
      .set(IGNORAR_REDIRECIONAMENTO_401, true)
      .set(IGNORAR_TRATAMENTO_GLOBAL_DE_ERRO, true);

    const validacao$ = this.http.get<UsuarioAutenticado>(this.usuarioUrl, { context }).pipe(
      takeUntil(this.sessaoEncerradaSubject),
      tap((usuario) => {
        this.salvarUsuario(usuario);
        this.tokenConfirmado = token;
        this.ultimaFalhaTemporariaEm = 0;
      }),
      map((): EstadoValidacaoSessao => 'autenticada'),
      catchError((erro: HttpErrorResponse) => {
        if (erro.status === 401) {
          this.logout();
          return of<EstadoValidacaoSessao>('nao-autenticada');
        }

        this.ultimaFalhaTemporariaEm = Date.now();
        return of<EstadoValidacaoSessao>('indisponivel');
      }),
      finalize(() => (this.validacaoSessaoEmCurso$ = null)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.validacaoSessaoEmCurso$ = validacao$;
    return validacao$;
  }

  podeVisualizarFilial(seqFilial: number | null | undefined): boolean {
    if (!seqFilial) {
      return false;
    }
    return this.filiaisVisualizaveis.some((filial) => filial.seq_filial === seqFilial);
  }

  podeEditarFilial(seqFilial: number | null | undefined): boolean {
    if (!seqFilial) {
      return false;
    }
    return this.filiaisEditaveis.some((filial) => filial.seq_filial === seqFilial);
  }

  get filiaisVisualizaveis(): FilialGestaoPermissao[] {
    return (this.getUsuario()?.filiais_gestao ?? []).filter((filial) => filial.st_visualiza);
  }

  get filiaisEditaveis(): FilialGestaoPermissao[] {
    return (this.getUsuario()?.filiais_gestao ?? []).filter(
      (filial) => filial.st_visualiza && filial.st_edita,
    );
  }

  estaAutenticado(): boolean {
    const token = this.getToken();
    return token !== null && this.tokenConfirmado === token;
  }

  private salvarSessao(resposta: LoginResponse): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(this.tokenKey, resposta.access_token);
    this.salvarUsuario(resposta.usuario);
    localStorage.setItem(this.expiracaoKey, resposta.expires_at);
    this.tokenConfirmado = resposta.access_token;
    this.ultimaFalhaTemporariaEm = 0;
  }

  private salvarUsuario(usuario: UsuarioAutenticado): void {
    const normalizado = this.normalizarUsuario(usuario);
    if (this.isBrowser()) {
      localStorage.setItem(this.usuarioKey, JSON.stringify(normalizado));
    }
    this.usuarioSubject.next(normalizado);
  }

  private lerUsuarioArmazenado(): UsuarioAutenticado | null {
    if (!this.isBrowser()) {
      return null;
    }
    const usuario = localStorage.getItem(this.usuarioKey);
    if (!usuario) {
      return null;
    }
    try {
      return this.normalizarUsuario(JSON.parse(usuario) as UsuarioAutenticado);
    } catch {
      this.logout();
      return null;
    }
  }

  private normalizarUsuario(usuario: UsuarioAutenticado): UsuarioAutenticado {
    return {
      ...usuario,
      filiais_gestao: Array.isArray(usuario.filiais_gestao) ? usuario.filiais_gestao : [],
    };
  }

  private tokenLocalValido(token: string): boolean {
    try {
      const partes = token.split('.');
      if (partes.length !== 3 || partes.some((parte) => !parte)) {
        return false;
      }

      const payloadBase64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
      const payloadComPadding = payloadBase64.padEnd(
        payloadBase64.length + ((4 - (payloadBase64.length % 4)) % 4),
        '=',
      );
      const payload = JSON.parse(atob(payloadComPadding)) as { exp?: unknown };

      return (
        typeof payload.exp === 'number' &&
        Number.isFinite(payload.exp) &&
        payload.exp * 1000 > Date.now()
      );
    } catch {
      return false;
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
