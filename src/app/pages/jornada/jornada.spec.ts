import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { DashboardService } from '../../services/dashboard.service';
import { FilialService } from '../../services/filial.service';
import { PessoaLiderService } from '../../services/pessoa-lider.service';
import { PessoaTrajetoriaEtapaService } from '../../services/pessoa-trajetoria-etapa.service';
import { PessoaTrajetoriaService } from '../../services/pessoa-trajetoria.service';
import { PessoaService } from '../../services/pessoa.service';
import { TrajetoriaEtapaService } from '../../services/trajetoria-etapa.service';
import { TrajetoriaService } from '../../services/trajetoria.service';
import { SituacaoTrajetoria } from '../../shared/enums/situacao-trajetoria.enum';
import { Jornada } from './jornada';

describe('Jornada - caracterização dos fluxos críticos', () => {
  let component: Jornada;
  let pessoaLiderService: {
    listar: ReturnType<typeof vi.fn>;
    definirEmLote: ReturnType<typeof vi.fn>;
  };
  let pessoaTrajetoriaService: {
    listar: ReturnType<typeof vi.fn>;
    listarHistorico: ReturnType<typeof vi.fn>;
    registrarEvolucao: ReturnType<typeof vi.fn>;
    atualizar: ReturnType<typeof vi.fn>;
  };
  let pessoaTrajetoriaEtapaService: {
    listar: ReturnType<typeof vi.fn>;
    atualizar: ReturnType<typeof vi.fn>;
  };
  let messageService: { add: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    pessoaLiderService = {
      listar: vi.fn(() => of([])),
      definirEmLote: vi.fn(() => of({ seq_lider: 20, quantidade: 1, liderancas: [] })),
    };
    pessoaTrajetoriaService = {
      listar: vi.fn(() => of([])),
      listarHistorico: vi.fn(() => of([])),
      registrarEvolucao: vi.fn(() =>
        of({ pessoa_trajetoria: {}, etapa_atual: {}, proxima_etapa: null }),
      ),
      atualizar: vi.fn(() => of({})),
    };
    pessoaTrajetoriaEtapaService = {
      listar: vi.fn(() => of([])),
      atualizar: vi.fn(() => of({})),
    };
    messageService = { add: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Jornada],
      providers: [
        { provide: DashboardService, useValue: { obterIndicadoresJornada: vi.fn(() => of(null)) } },
        { provide: FilialService, useValue: { listar: vi.fn(() => of([])) } },
        {
          provide: PessoaService,
          useValue: { listar: vi.fn(() => of([])), formatarTelefone: vi.fn() },
        },
        { provide: PessoaLiderService, useValue: pessoaLiderService },
        { provide: PessoaTrajetoriaService, useValue: pessoaTrajetoriaService },
        { provide: PessoaTrajetoriaEtapaService, useValue: pessoaTrajetoriaEtapaService },
        { provide: TrajetoriaService, useValue: { listar: vi.fn(() => of([])) } },
        { provide: TrajetoriaEtapaService, useValue: { listar: vi.fn(() => of([])) } },
        { provide: MessageService, useValue: messageService },
      ],
    })
      .overrideComponent(Jornada, { set: { template: '' } })
      .compileComponents();

    component = TestBed.createComponent(Jornada).componentInstance;
  });

  it('abre e fecha a modal de líder com as pessoas selecionadas', () => {
    const linha = criarLinha();
    component.selecionadas = [linha];

    component.abrirModalLider();

    expect(component.modalLiderVisivel).toBe(true);
    expect(component.pessoasSelecionadas.map((pessoa) => pessoa.seq_pessoa)).toEqual([10]);

    component.modalLiderVisivel = false;
    expect(component.modalLiderVisivel).toBe(false);
  });

  it('fecha a modal, limpa a seleção e recarrega após o filho definir o líder', () => {
    const linha = criarLinha();
    component.selecionadas = [linha];
    component.modalLiderVisivel = true;
    const recarregar = vi.spyOn(component, 'carregarDados').mockImplementation(() => undefined);

    component.aoDefinirLiderSalvo();

    expect(component.modalLiderVisivel).toBe(false);
    expect(component.selecionadas).toEqual([]);
    expect(recarregar).toHaveBeenCalledOnce();
  });

  it('abre e fecha a modal de evolução com a linha e a etapa atuais', () => {
    const linha = criarLinha();

    component.abrirModalEvolucao(linha);

    expect(component.modalEvolucaoVisivel).toBe(true);
    expect(component.linhaEvolucao).toBe(linha);
    expect(component.etapaEvolucao).toBe(linha.etapas[0]);

    component.modalEvolucaoVisivel = false;
    expect(component.modalEvolucaoVisivel).toBe(false);
  });

  it('fecha a modal e recarrega a Jornada após o filho registrar a evolução', () => {
    component.modalEvolucaoVisivel = true;
    const recarregar = vi.spyOn(component, 'carregarDados').mockImplementation(() => undefined);

    component.aoRegistrarEvolucaoSalva();

    expect(component.modalEvolucaoVisivel).toBe(false);
    expect(recarregar).toHaveBeenCalledOnce();
  });

  it('abre e fecha o drawer com o registro selecionado', () => {
    const linha = criarLinha();

    component.abrirDetalhes(linha);

    expect(component.drawerVisivel).toBe(true);
    expect(component.linhaDetalhada).toBe(linha);

    component.drawerVisivel = false;
    expect(component.drawerVisivel).toBe(false);
  });
});

function criarLinha(): any {
  return {
    pessoaTrajetoria: {
      seq_pessoa_trajetoria: 30,
      seq_pessoa: 10,
      seq_trajetoria: 40,
      nu_situacao: SituacaoTrajetoria.NAO_INICIADA,
      dt_inicio: '2026-07-20',
      dt_conclusao: null,
      ds_observacao: null,
    },
    pessoa: {
      seq_pessoa: 10,
      ds_nome: 'Aldo',
      st_ativo: true,
      dh_inclusao: '2026-07-20T10:00:00',
      seq_filial: 1,
      lider: null,
    },
    trajetoria: {
      seq_trajetoria: 40,
      ds_nome: 'Integração',
      nr_versao: 1,
      st_ativo: true,
    },
    filial: null,
    etapas: [
      {
        modelo: {
          seq_trajetoria_etapa: 60,
          seq_trajetoria: 40,
          seq_etapa_trajetoria: 1,
          ds_nome: 'Primeiro contato',
          nr_ordem: 1,
          st_obrigatoria: true,
          st_permite_pular: true,
          st_exige_observacao: false,
          st_ativo: true,
        },
        acompanhamento: {
          seq_pessoa_trajetoria_etapa: 50,
          seq_pessoa_trajetoria: 30,
          seq_trajetoria_etapa: 60,
          nu_situacao: SituacaoTrajetoria.NAO_INICIADA,
          dt_inicio: null,
          dt_conclusao: null,
          ds_observacao: 'Observação atual',
          ds_motivo_pulo: null,
        },
      },
    ],
  };
}
