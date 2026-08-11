import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { apiErrorInterceptor } from '../core/interceptors/api-error.interceptor';
import { authInterceptor } from '../core/interceptors/auth.interceptor';
import { ApiWarmupService } from './api-warmup.service';

describe('ApiWarmupService', () => {
  let service: ApiWarmupService;
  let httpTesting: HttpTestingController;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        MessageService,
        provideHttpClient(withInterceptors([authInterceptor, apiErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ApiWarmupService);
    httpTesting = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);
    localStorage.clear();
    localStorage.setItem('renascer_access_token', 'token-existente');
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('chama o endpoint configurado sem enviar token de autenticação', () => {
    let resultado: string | undefined;

    service.aquecer().subscribe((estado) => (resultado = estado));

    const request = httpTesting.expectOne('http://127.0.0.1:8000/health/ready');
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.has('Authorization')).toBe(false);

    request.flush({ status: 'ready' });
    expect(resultado).toBe('pronta');
  });

  it('reutiliza a requisição em andamento e evita chamadas duplicadas', () => {
    service.aquecer().subscribe();
    service.aquecer().subscribe();

    const requests = httpTesting.match('http://127.0.0.1:8000/health/ready');
    expect(requests).toHaveLength(1);

    requests[0].flush({ status: 'ready' });
  });

  it('converte falhas em estado discreto sem acionar a notificação global', () => {
    const addSpy = vi.spyOn(messageService, 'add');
    let resultado: string | undefined;

    service.aquecer().subscribe((estado) => (resultado = estado));
    httpTesting
      .expectOne('http://127.0.0.1:8000/health/ready')
      .flush({}, { status: 503, statusText: 'Service Unavailable' });

    expect(resultado).toBe('demorando');
    expect(addSpy).not.toHaveBeenCalled();
  });
});
