import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, finalize, shareReplay, tap } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private atualizacaoUsuarioEmCurso$: Observable<UsuarioAutenticado> | null = null;
  readonly usuarioAtual$ = this.usuarioSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.usuarioSubject.next(this.lerUsuarioArmazenado());
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
    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    localStorage.removeItem(this.expiracaoKey);
    this.usuarioSubject.next(null);
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }

  getUsuario(): UsuarioAutenticado | null {
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
      tap((usuario) => this.salvarUsuario(usuario)),
      finalize(() => (this.atualizacaoUsuarioEmCurso$ = null)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.atualizacaoUsuarioEmCurso$ = atualizacao$;
    return atualizacao$;
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

    if (!token) {
      return false;
    }

    const expiracao = this.obterExpiracao(token);

    if (expiracao !== null && expiracao <= Date.now()) {
      this.logout();
      return false;
    }

    return true;
  }

  private salvarSessao(resposta: LoginResponse): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(this.tokenKey, resposta.access_token);
    this.salvarUsuario(resposta.usuario);
    localStorage.setItem(this.expiracaoKey, resposta.expires_at);
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

  private obterExpiracao(token: string): number | null {
    const expiracaoSalva = localStorage.getItem(this.expiracaoKey);
    const expiracaoEmMs = expiracaoSalva ? Date.parse(expiracaoSalva) : NaN;

    if (!Number.isNaN(expiracaoEmMs)) {
      return expiracaoEmMs;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
