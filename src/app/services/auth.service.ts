import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  ds_usuario: string;
  ds_senha: string;
}

export interface UsuarioAutenticado {
  seq_usuario: number;
  ds_usuario: string;
  ds_nome: string;
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
  private readonly apiUrl = `${environment.apiUrl}/auth/login`;
  private readonly tokenKey = 'renascer_access_token';
  private readonly usuarioKey = 'renascer_usuario';
  private readonly expiracaoKey = 'renascer_token_expires_at';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  login(credenciais: LoginRequest): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('username', credenciais.ds_usuario)
      .set('password', credenciais.ds_senha);

    return this.http
      .post<LoginResponse>(this.apiUrl, body.toString(), {
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
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }

  getUsuario(): UsuarioAutenticado | null {
    if (!this.isBrowser()) {
      return null;
    }

    const usuario = localStorage.getItem(this.usuarioKey);

    if (!usuario) {
      return null;
    }

    try {
      return JSON.parse(usuario) as UsuarioAutenticado;
    } catch {
      this.logout();
      return null;
    }
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
    localStorage.setItem(this.usuarioKey, JSON.stringify(resposta.usuario));
    localStorage.setItem(this.expiracaoKey, resposta.expires_at);
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
