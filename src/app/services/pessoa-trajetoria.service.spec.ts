import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import {
  PessoaElegivelTrajetoria,
  PessoaTrajetoriaEvolucaoCreate,
  PessoaTrajetoriaLoteCreate,
  PessoaTrajetoriaLoteResponse,
  PessoaTrajetoriaService,
} from './pessoa-trajetoria.service';
import { SituacaoTrajetoria } from '../shared/enums/situacao-trajetoria.enum';

describe('PessoaTrajetoriaService', () => {
  let service: PessoaTrajetoriaService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PessoaTrajetoriaService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('deve consultar as pessoas elegíveis para a filial e a jornada', () => {
    const resposta: PessoaElegivelTrajetoria[] = [
      {
        seq_pessoa: 10,
        ds_nome: 'Ana Souza',
        nr_telefone: '61999990000',
        tp_genero: 'F',
        dt_nascimento: '1990-01-01',
        seq_filial: 1,
        seq_vinculo: 2,
        seq_faixa_etaria: 3,
        seq_lider: null,
      },
    ];

    service.listarElegiveis(1, 2).subscribe((pessoas) => expect(pessoas).toEqual(resposta));

    const requisicao = httpTesting.expectOne(
      (request) => request.url === `${environment.apiUrl}/pessoas-trajetorias/elegiveis`,
    );
    expect(requisicao.request.method).toBe('GET');
    expect(requisicao.request.params.get('seq_filial')).toBe('1');
    expect(requisicao.request.params.get('seq_trajetoria')).toBe('2');
    requisicao.flush(resposta);
  });

  it('deve iniciar todas as jornadas em uma única requisição', () => {
    const payload: PessoaTrajetoriaLoteCreate = {
      seq_filial: 1,
      seq_trajetoria: 2,
      seq_pessoas: [10, 11],
      dt_inicio: '2026-07-20',
      ds_observacao: 'Inclusão inicial',
    };
    const resposta: PessoaTrajetoriaLoteResponse = {
      seq_filial: 1,
      seq_trajetoria: 2,
      quantidade: 2,
      pessoas_trajetorias: [],
    };

    service.criarEmLote(payload).subscribe((resultado) => expect(resultado).toEqual(resposta));

    const requisicao = httpTesting.expectOne(`${environment.apiUrl}/pessoas-trajetorias/lote`);
    expect(requisicao.request.method).toBe('POST');
    expect(requisicao.request.body).toEqual(payload);
    requisicao.flush(resposta);
  });

  it('deve registrar uma evolução individual no endpoint de domínio', () => {
    const payload: PessoaTrajetoriaEvolucaoCreate = {
      seq_pessoa_trajetoria_etapa: 9,
      nu_situacao: SituacaoTrajetoria.CONCLUIDA,
      dt_evento: '2026-07-22',
      ds_observacao: 'Etapa concluída',
      ds_motivo_pulo: null,
    };
    service.registrarEvolucao(7, payload).subscribe();
    const requisicao = httpTesting.expectOne(
      `${environment.apiUrl}/pessoas-trajetorias/7/evolucoes`,
    );
    expect(requisicao.request.method).toBe('POST');
    expect(requisicao.request.body).toEqual(payload);
    requisicao.flush({ pessoa_trajetoria: {}, etapa_atual: {}, proxima_etapa: null });
  });

  it('deve consultar o histórico completo da jornada', () => {
    service.listarHistorico(7).subscribe((historico) => expect(historico).toEqual([]));
    const requisicao = httpTesting.expectOne(
      `${environment.apiUrl}/pessoas-trajetorias/7/historico`,
    );
    expect(requisicao.request.method).toBe('GET');
    requisicao.flush([]);
  });
});
