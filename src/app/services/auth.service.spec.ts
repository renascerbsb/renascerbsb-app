import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { authInterceptor } from '../core/interceptors/auth.interceptor';
import { AuthService, LoginResponse } from './auth.service';

const TOKEN_KEY = 'renascer_access_token';
const USUARIO_KEY = 'renascer_usuario';
const EXPIRACAO_KEY = 'renascer_token_expires_at';
const TOKEN_VALIDO = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQxMDI0NDQ4MDB9.assinatura';
const TOKEN_EXPIRADO = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Nzc4MzY4MDB9.assinatura';

const respostaLogin: LoginResponse = {
  access_token: TOKEN_VALIDO,
  token_type: 'bearer',
  expires_at: '2099-07-14T14:16:28Z',
  expires_in: 3600,
  usuario: {
    seq_usuario: 1,
    ds_usuario: 'admin',
    ds_nome: 'Administrador',
    filiais_gestao: [
      { seq_filial: 1, st_visualiza: true, st_edita: true },
      { seq_filial: 2, st_visualiza: true, st_edita: false },
    ],
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('envia as credenciais OAuth2 como application/x-www-form-urlencoded', () => {
    service.login({ ds_usuario: 'admin', ds_senha: '123' }).subscribe();

    const request = httpTesting.expectOne('http://127.0.0.1:8000/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
    expect(request.request.body).toBe('username=admin&password=123');

    request.flush(respostaLogin);

    expect(localStorage.getItem(TOKEN_KEY)).toBe(respostaLogin.access_token);
    expect(localStorage.getItem(EXPIRACAO_KEY)).toBe(respostaLogin.expires_at);
    expect(JSON.parse(localStorage.getItem(USUARIO_KEY) ?? '{}')).toEqual(respostaLogin.usuario);
  });

  it('confirma no auth/me uma sessão local com JWT válido', () => {
    localStorage.setItem(TOKEN_KEY, respostaLogin.access_token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respostaLogin.usuario));
    localStorage.setItem(EXPIRACAO_KEY, respostaLogin.expires_at);
    let estado: string | undefined;

    service.validarSessao().subscribe((resultado) => (estado = resultado));
    httpTesting.expectOne('http://127.0.0.1:8000/auth/me').flush(respostaLogin.usuario);

    expect(estado).toBe('autenticada');
    expect(service.estaAutenticado()).toBe(true);
    expect(service.getToken()).toBe(respostaLogin.access_token);
    expect(service.getUsuario()).toEqual(respostaLogin.usuario);
  });

  it('encerra automaticamente uma sessão cujo JWT está expirado', () => {
    localStorage.setItem(TOKEN_KEY, TOKEN_EXPIRADO);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respostaLogin.usuario));
    localStorage.setItem(EXPIRACAO_KEY, respostaLogin.expires_at);

    expect(service.temSessaoLocalValida()).toBe(false);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USUARIO_KEY)).toBeNull();
    expect(localStorage.getItem(EXPIRACAO_KEY)).toBeNull();
  });

  it('remove uma sessão com token malformado mesmo que a expiração armazenada seja futura', () => {
    localStorage.setItem(TOKEN_KEY, 'token-antigo-invalido');
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respostaLogin.usuario));
    localStorage.setItem(EXPIRACAO_KEY, respostaLogin.expires_at);

    expect(service.temSessaoLocalValida()).toBe(false);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USUARIO_KEY)).toBeNull();
    expect(localStorage.getItem(EXPIRACAO_KEY)).toBeNull();
  });

  it('limpa a sessão quando auth/me retorna 401', () => {
    localStorage.setItem(TOKEN_KEY, TOKEN_VALIDO);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respostaLogin.usuario));
    localStorage.setItem(EXPIRACAO_KEY, respostaLogin.expires_at);
    let estado: string | undefined;

    service.validarSessao().subscribe((resultado) => (estado = resultado));
    httpTesting
      .expectOne('http://127.0.0.1:8000/auth/me')
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(estado).toBe('nao-autenticada');
    expect(service.getToken()).toBeNull();
    expect(service.getUsuario()).toBeNull();
  });

  it('preserva a sessão local válida quando auth/me falha temporariamente', () => {
    localStorage.setItem(TOKEN_KEY, TOKEN_VALIDO);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respostaLogin.usuario));
    localStorage.setItem(EXPIRACAO_KEY, respostaLogin.expires_at);
    let estado: string | undefined;

    service.validarSessao().subscribe((resultado) => (estado = resultado));
    httpTesting
      .expectOne('http://127.0.0.1:8000/auth/me')
      .flush({}, { status: 503, statusText: 'Service Unavailable' });

    expect(estado).toBe('indisponivel');
    expect(service.getToken()).toBe(TOKEN_VALIDO);
    expect(service.getUsuario()).toEqual(respostaLogin.usuario);
  });

  it('reutiliza uma única validação de auth/me enquanto ela estiver em andamento', () => {
    localStorage.setItem(TOKEN_KEY, TOKEN_VALIDO);

    service.validarSessao().subscribe();
    service.validarSessao().subscribe();

    const requests = httpTesting.match('http://127.0.0.1:8000/auth/me');
    expect(requests).toHaveLength(1);
    requests[0].flush(respostaLogin.usuario);
  });

  it('remove todos os dados da sessão no logout', () => {
    localStorage.setItem(TOKEN_KEY, respostaLogin.access_token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respostaLogin.usuario));
    localStorage.setItem(EXPIRACAO_KEY, respostaLogin.expires_at);
    localStorage.setItem('theme', 'light');

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.getUsuario()).toBeNull();
    expect(localStorage.getItem(EXPIRACAO_KEY)).toBeNull();
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('limpa o usuário mantido em memória ao encerrar a sessão', () => {
    const usuarios: Array<unknown> = [];
    service.usuarioAtual$.subscribe((usuario) => usuarios.push(usuario));
    service.login({ ds_usuario: 'admin', ds_senha: '123' }).subscribe();
    httpTesting.expectOne('http://127.0.0.1:8000/auth/login').flush(respostaLogin);

    service.logout();

    expect(usuarios.at(-1)).toBeNull();
  });
  it('atualiza as permissões pelo auth/me e não infere acesso para usuário sem filiais', () => {
    service.atualizarUsuario().subscribe();

    const request = httpTesting.expectOne('http://127.0.0.1:8000/auth/me');
    request.flush({ ...respostaLogin.usuario, filiais_gestao: [] });

    expect(service.filiaisVisualizaveis).toEqual([]);
    expect(service.filiaisEditaveis).toEqual([]);
    expect(service.podeVisualizarFilial(1)).toBe(false);
  });

  it('diferencia permissão de visualização e edição', () => {
    localStorage.setItem(TOKEN_KEY, TOKEN_VALIDO);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respostaLogin.usuario));
    localStorage.setItem(EXPIRACAO_KEY, respostaLogin.expires_at);

    expect(service.podeVisualizarFilial(1)).toBe(true);
    expect(service.podeEditarFilial(1)).toBe(true);
    expect(service.podeVisualizarFilial(2)).toBe(true);
    expect(service.podeEditarFilial(2)).toBe(false);
  });
});

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
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

  it('recarrega auth/me após 403 sem encerrar a sessão', () => {
    http.get('/operacao-protegida').subscribe({ error: () => undefined });

    httpTesting
      .expectOne('/operacao-protegida')
      .flush({}, { status: 403, statusText: 'Forbidden' });
    httpTesting.expectOne('http://127.0.0.1:8000/auth/me').flush({
      ...respostaLogin.usuario,
      filiais_gestao: [{ seq_filial: 2, st_visualiza: true, st_edita: false }],
    });

    expect(authService.getToken()).toBe(respostaLogin.access_token);
    expect(authService.podeEditarFilial(1)).toBe(false);
    expect(authService.podeVisualizarFilial(2)).toBe(true);
  });

  it('deixa o guard tratar o 401 da validação inicial sem navegação concorrente', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    let estado: string | undefined;

    authService.validarSessao().subscribe((resultado) => (estado = resultado));
    httpTesting
      .expectOne('http://127.0.0.1:8000/auth/me')
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(estado).toBe('nao-autenticada');
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('não envia o token antigo em requisições posteriores ao logout', () => {
    authService.logout();

    http.get('/apos-logout').subscribe();

    const request = httpTesting.expectOne('/apos-logout');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  it('permite autenticar novamente depois do logout', () => {
    authService.logout();

    authService.login({ ds_usuario: 'admin', ds_senha: '123' }).subscribe();
    httpTesting.expectOne('http://127.0.0.1:8000/auth/login').flush(respostaLogin);

    expect(authService.estaAutenticado()).toBe(true);
    expect(authService.getToken()).toBe(respostaLogin.access_token);
  });
});
