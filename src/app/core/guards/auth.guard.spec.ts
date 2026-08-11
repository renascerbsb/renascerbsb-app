import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  TestRequest,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import { of } from 'rxjs';
import { ApiWarmupService } from '../../services/api-warmup.service';
import { AuthService, UsuarioAutenticado } from '../../services/auth.service';
import { authGuard, guestGuard } from './auth.guard';

const TOKEN_KEY = 'renascer_access_token';
const USUARIO_KEY = 'renascer_usuario';
const EXPIRACAO_KEY = 'renascer_token_expires_at';
const TOKEN_VALIDO = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQxMDI0NDQ4MDB9.assinatura';
const TOKEN_EXPIRADO = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Nzc4MzY4MDB9.assinatura';
const USUARIO: UsuarioAutenticado = {
  seq_usuario: 1,
  ds_usuario: 'admin',
  ds_nome: 'Administrador',
  filiais_gestao: [],
};

@Component({ template: '' })
class PaginaTeste {}

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'login', component: PaginaTeste, canActivate: [guestGuard] },
  { path: 'inicio', component: PaginaTeste, canActivate: [authGuard] },
  { path: 'pessoas', component: PaginaTeste, canActivate: [authGuard] },
];

describe('redirecionamento e validação da sessão', () => {
  let router: Router;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ApiWarmupService,
          useValue: { aquecer: vi.fn(() => of('pronta')) },
        },
      ],
    });

    router = TestBed.inject(Router);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('direciona o acesso à raiz sem token para login', async () => {
    localStorage.setItem(USUARIO_KEY, JSON.stringify(USUARIO));
    localStorage.setItem(EXPIRACAO_KEY, '2099-01-01T00:00:00Z');

    await router.navigateByUrl('/');

    expect(router.url).toContain('/login');
    expect(router.parseUrl(router.url).queryParams['returnUrl']).toBe('/inicio');
    expect(localStorage.getItem(USUARIO_KEY)).toBeNull();
    expect(localStorage.getItem(EXPIRACAO_KEY)).toBeNull();
  });

  it('direciona o acesso à raiz com token expirado para login e limpa a sessão', async () => {
    armazenarSessao(TOKEN_EXPIRADO);

    await router.navigateByUrl('/');

    expect(router.url).toContain('/login');
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USUARIO_KEY)).toBeNull();
  });

  it('direciona o acesso à raiz com token malformado para login e limpa a sessão', async () => {
    armazenarSessao('token-malformado');

    await router.navigateByUrl('/');

    expect(router.url).toContain('/login');
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USUARIO_KEY)).toBeNull();
  });

  it('direciona o acesso à raiz para inicio quando o JWT e auth/me são válidos', async () => {
    armazenarSessao(TOKEN_VALIDO);

    const navegacao = router.navigateByUrl('/');
    (await aguardarRequisicaoAuthMe()).flush(USUARIO);
    await navegacao;

    expect(router.url).toBe('/inicio');
    expect(TestBed.inject(AuthService).estaAutenticado()).toBe(true);
  });

  it('limpa a sessão e direciona para login quando auth/me retorna 401', async () => {
    armazenarSessao(TOKEN_VALIDO);

    const navegacao = router.navigateByUrl('/');
    (await aguardarRequisicaoAuthMe()).flush({}, { status: 401, statusText: 'Unauthorized' });
    await navegacao;

    expect(router.url).toContain('/login');
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USUARIO_KEY)).toBeNull();
  });

  it('preserva o returnUrl ao bloquear uma rota protegida', async () => {
    await router.navigateByUrl('/pessoas');

    expect(router.url).toContain('/login');
    expect(router.parseUrl(router.url).queryParams['returnUrl']).toBe('/pessoas');
  });

  it('não cria loop quando auth/me falha temporariamente e preserva o token', async () => {
    armazenarSessao(TOKEN_VALIDO);

    const navegacao = router.navigateByUrl('/');
    (await aguardarRequisicaoAuthMe()).flush(
      {},
      { status: 503, statusText: 'Service Unavailable' },
    );
    await navegacao;

    expect(router.url).toContain('/login');
    expect(localStorage.getItem(TOKEN_KEY)).toBe(TOKEN_VALIDO);
    expect(httpTesting.match('http://127.0.0.1:8000/auth/me')).toHaveLength(0);
  });

  async function aguardarRequisicaoAuthMe(): Promise<TestRequest> {
    let request: TestRequest | undefined;

    await vi.waitFor(() => {
      request ??= httpTesting.match('http://127.0.0.1:8000/auth/me')[0];
      expect(request).toBeDefined();
    });

    return request!;
  }
});

function armazenarSessao(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USUARIO_KEY, JSON.stringify(USUARIO));
  localStorage.setItem(EXPIRACAO_KEY, '2099-01-01T00:00:00Z');
}
