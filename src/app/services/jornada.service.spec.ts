import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { SituacaoTrajetoria } from '../shared/enums/situacao-trajetoria.enum';
import { JornadaKpis, JornadaPaginada, JornadaService } from './jornada.service';

describe('JornadaService', () => {
  let service: JornadaService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(JornadaService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('mapeia paginação, filtros e ordenação para os nomes do contrato HTTP', () => {
    const resposta: JornadaPaginada = {
      items: [],
      page: 3,
      page_size: 20,
      total_items: 0,
      total_pages: 0,
    };

    service
      .listar({
        page: 3,
        pageSize: 20,
        pesquisa: '  Ana  ',
        seqFilial: 2,
        seqTrajetoria: 4,
        nuSituacao: SituacaoTrajetoria.EM_ANDAMENTO,
        semLider: false,
        sort: 'proxima_acao',
        order: 'desc',
      })
      .subscribe((dados) => expect(dados).toEqual(resposta));

    const requisicao = httpTesting.expectOne(
      (request) => request.url === `${environment.apiUrl}/jornadas/`,
    );
    expect(requisicao.request.method).toBe('GET');
    expect(requisicao.request.params.get('page')).toBe('3');
    expect(requisicao.request.params.get('page_size')).toBe('20');
    expect(requisicao.request.params.get('pesquisa')).toBe('Ana');
    expect(requisicao.request.params.get('seq_filial')).toBe('2');
    expect(requisicao.request.params.get('seq_trajetoria')).toBe('4');
    expect(requisicao.request.params.get('nu_situacao')).toBe('2');
    expect(requisicao.request.params.get('sem_lider')).toBe('false');
    expect(requisicao.request.params.get('sort')).toBe('proxima_acao');
    expect(requisicao.request.params.get('order')).toBe('desc');
    requisicao.flush(resposta);
  });

  it('omite filtros vazios e consulta os KPIs no endpoint novo', () => {
    const resposta: JornadaKpis = {
      periodo_dias: 30,
      novos_visitantes: 1,
      sem_lider: 2,
      em_acompanhamento: 3,
      jornadas_concluidas: 4,
      pendencias_vencidas: 5,
    };

    service.listar({ page: 1, pageSize: 10, pesquisa: ' ' }).subscribe();
    const listagem = httpTesting.expectOne(
      (request) => request.url === `${environment.apiUrl}/jornadas/`,
    );
    expect(listagem.request.params.has('pesquisa')).toBe(false);
    listagem.flush({ items: [], page: 1, page_size: 10, total_items: 0, total_pages: 0 });

    service.obterKpis(7).subscribe((dados) => expect(dados).toEqual(resposta));
    const kpis = httpTesting.expectOne(
      (request) => request.url === `${environment.apiUrl}/dashboard/jornada/kpis`,
    );
    expect(kpis.request.params.get('seq_filial')).toBe('7');
    expect(kpis.request.params.get('periodo_dias')).toBe('30');
    kpis.flush(resposta);
  });
});
