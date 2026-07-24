import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { authInterceptor } from '../core/interceptors/auth.interceptor';
import { AuthService, LoginResponse } from './auth.service';

const TOKEN_KEY = 'renascer_access_token';
const USUARIO_KEY = 'renascer_usuario';
const EXPIRACAO_KEY = 'renascer_token_expires_at';

const respostaLogin: LoginResponse = {
  access_token: 'jwt-de-teste',
  token_type: 'bearer',
  expires_at: '2099-07-14T14:16:28Z',
  expires_in: 3600,
  usuario: {
    seq_usuario: 1,
    ds_usuario: 'admin',
    ds_nome: 'Administrador',
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('envia as credenciais OAuth2 como application/x-www-form-urlencoded', () => {
    service.login({ ds_usuario: 'admin', ds_senha: '123' }).subscribe();

    const request = httpTesting.expectOne('http://127.0.0.1:8000/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Content-Type')).toBe(
      'application/x-www-form-urlencoded',
    );
    expect(request.request.body).toBe('username=admin&password=123');

    request.flush(respostaLogin);

    expect(localStorage.getItem(TOKEN_KEY)).toBe(respostaLogin.access_token);
    expect(localStorage.getItem(EXPIRACAO_KEY)).toBe(respostaLogin.expires_at);
    expect(JSON.parse(localStorage.getItem(USUARIO_KEY) ?? '{}')).toEqual(respostaLogin.usuario);
  });

  it('restaura uma sessão válida armazenada', () => {
    localStorage.setItem(TOKEN_KEY, respostaLogin.access_token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respostaLogin.usuario));
    localStorage.setItem(EXPIRACAO_KEY, respostaLogin.expires_at);

    expect(service.estaAutenticado()).toBe(true);
    expect(service.getToken()).toBe(respostaLogin.access_token);
    expect(service.getUsuario()).toEqual(respostaLogin.usuario);
  });

  it('encerra automaticamente uma sessão expirada', () => {
    localStorage.setItem(TOKEN_KEY, respostaLogin.access_token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respostaLogin.usuario));
    localStorage.setItem(EXPIRACAO_KEY, '2020-01-01T00:00:00Z');

    expect(service.estaAutenticado()).toBe(false);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USUARIO_KEY)).toBeNull();
    expect(localStorage.getItem(EXPIRACAO_KEY)).toBeNull();
  });

  it('remove todos os dados da sessão no logout', () => {
    localStorage.setItem(TOKEN_KEY, respostaLogin.access_token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respostaLogin.usuario));
    localStorage.setItem(EXPIRACAO_KEY, respostaLogin.expires_at);

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.getUsuario()).toBeNull();
    expect(localStorage.getItem(EXPIRACAO_KEY)).toBeNull();
  });
});

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    localStorage.clear();
    localStorage.setItem(TOKEN_KEY, respostaLogin.access_token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respostaLogin.usuario));
    localStorage.setItem(EXPIRACAO_KEY, respostaLogin.expires_at);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('envia o Bearer token e encerra a sessão ao receber 401', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    http.get('/recurso-protegido').subscribe({ error: () => undefined });

    const request = httpTesting.expectOne('/recurso-protegido');
    expect(request.request.headers.get('Authorization')).toBe(
      `Bearer ${respostaLogin.access_token}`,
    );
    request.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(authService.getToken()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/' },
    });
  });
});
