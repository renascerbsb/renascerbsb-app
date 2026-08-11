import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { DashboardJornada, DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpTesting: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardService);
    httpTesting = TestBed.inject(HttpTestingController);
  });
  afterEach(() => httpTesting.verify());

  it('deve consultar os indicadores da Jornada com período e filial', () => {
    const resposta: DashboardJornada = {
      periodo_dias: 30,
      novos_visitantes: 4,
      pessoas_em_jornada: 8,
      jornadas_concluidas: 3,
      pendencias_vencidas: 1,
    };
    service.obterIndicadoresJornada(2, 30).subscribe((dados) => expect(dados).toEqual(resposta));
    const requisicao = httpTesting.expectOne(
      (request) => request.url === `${environment.apiUrl}/dashboard/jornada`,
    );
    expect(requisicao.request.method).toBe('GET');
    expect(requisicao.request.params.get('seq_filial')).toBe('2');
    expect(requisicao.request.params.get('periodo_dias')).toBe('30');
    requisicao.flush(resposta);
  });

  it('deve enviar seq_filial de forma repetível ao dashboard agregado', () => {
    service.obterDashboard([1, 2]).subscribe();
    const requisicao = httpTesting.expectOne(
      (request) => request.url === `${environment.apiUrl}/dashboard`,
    );
    expect(requisicao.request.method).toBe('GET');
    expect(requisicao.request.params.getAll('seq_filial')).toEqual(['1', '2']);
    requisicao.flush({});
  });

  it('deve manter o endpoint operacional de Jornada separado', () => {
    service.obterKpisJornada(3, 60).subscribe();
    const requisicao = httpTesting.expectOne(
      (request) => request.url === `${environment.apiUrl}/dashboard/jornada/kpis`,
    );
    expect(requisicao.request.params.get('seq_filial')).toBe('3');
    expect(requisicao.request.params.get('periodo_dias')).toBe('60');
    requisicao.flush({});
  });
});
