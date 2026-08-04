import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { FilialService } from '../../services/filial.service';
import { AuthService } from '../../services/auth.service';
import { JornadaPaginada, JornadaService } from '../../services/jornada.service';
import { PessoaService } from '../../services/pessoa.service';
import { TrajetoriaEtapaService } from '../../services/trajetoria-etapa.service';
import { TrajetoriaService } from '../../services/trajetoria.service';
import { SituacaoTrajetoria } from '../../shared/enums/situacao-trajetoria.enum';
import { JornadaLinha } from './interfaces/jornada.models';
import { Jornada } from './jornada';

describe('Jornada - integração agregada', () => {
  let component: Jornada;
  let jornadaService: {
    listar: ReturnType<typeof vi.fn>;
    obterKpis: ReturnType<typeof vi.fn>;
  };
  let pessoaService: {
    listar: ReturnType<typeof vi.fn>;
    formatarTelefone: ReturnType<typeof vi.fn>;
  };
  let trajetoriaEtapaService: { buscarPorId: ReturnType<typeof vi.fn> };
  let authService: {
    atualizarUsuario: ReturnType<typeof vi.fn>;
    podeVisualizarFilial: ReturnType<typeof vi.fn>;
    podeEditarFilial: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    jornadaService = {
      listar: vi.fn(() => of(respostaPaginada([criarLinha()]))),
      obterKpis: vi.fn(() =>
        of({
          periodo_dias: 30,
          novos_visitantes: 1,
          sem_lider: 2,
          em_acompanhamento: 3,
          jornadas_concluidas: 4,
          pendencias_vencidas: 5,
        }),
      ),
    };
    pessoaService = {
      listar: vi.fn(() => of([])),
      formatarTelefone: vi.fn((telefone) => telefone ?? ''),
    };
    trajetoriaEtapaService = {
      buscarPorId: vi.fn(() => of(criarConfiguracaoEtapa())),
    };
    authService = {
      atualizarUsuario: vi.fn(() => of({})),
      podeVisualizarFilial: vi.fn(() => true),
      podeEditarFilial: vi.fn(() => true),
    };

    await TestBed.configureTestingModule({
      imports: [Jornada],
      providers: [
        { provide: JornadaService, useValue: jornadaService },
        {
          provide: FilialService,
          useValue: {
            listarGestao: vi.fn(() =>
              of([
                {
                  seq_filial: 1,
                  ds_nome: 'Sede',
                  st_ativo: true,
                  st_visualiza: true,
                  st_edita: true,
                },
              ]),
            ),
          },
        },
        { provide: AuthService, useValue: authService },
        { provide: PessoaService, useValue: pessoaService },
        { provide: TrajetoriaService, useValue: { listar: vi.fn(() => of([])) } },
        { provide: TrajetoriaEtapaService, useValue: trajetoriaEtapaService },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    })
      .overrideComponent(Jornada, { set: { template: '' } })
      .compileComponents();

    component = TestBed.createComponent(Jornada).componentInstance;
    component.ngOnInit();
  });

  it('converte o índice zero do PrimeNG para a página iniciada em um da API', () => {
    component.aoCarregarTabela({ first: 20, rows: 10, sortField: 'pessoa', sortOrder: 1 });

    expect(jornadaService.listar).toHaveBeenLastCalledWith({
      page: 3,
      pageSize: 10,
      sort: 'pessoa',
      order: 'asc',
    });
    expect(component.totalRegistros).toBe(1);
  });

  it('reinicia a primeira página e envia apenas ordenações autorizadas', () => {
    component.consulta = { page: 4, pageSize: 10, sort: 'pessoa', order: 'asc' };

    component.aoCarregarTabela({ first: 30, rows: 10, sortField: 'lider', sortOrder: -1 });

    expect(component.primeiroRegistro).toBe(0);
    expect(jornadaService.listar).toHaveBeenLastCalledWith({
      page: 1,
      pageSize: 10,
      sort: 'lider',
      order: 'desc',
    });
  });

  it('envia pesquisa e filtros ao backend sem filtrar novamente os itens recebidos', () => {
    component.filtro = {
      busca: ' Ana ',
      seqFilial: 2,
      seqTrajetoria: 4,
      nuSituacao: SituacaoTrajetoria.EM_ANDAMENTO,
      lideranca: 'sem',
    };

    component.pesquisar();

    expect(jornadaService.listar).toHaveBeenLastCalledWith({
      page: 1,
      pageSize: 10,
      pesquisa: 'Ana',
      seqFilial: 2,
      seqTrajetoria: 4,
      nuSituacao: SituacaoTrajetoria.EM_ANDAMENTO,
      semLider: true,
      sort: 'pessoa',
      order: 'asc',
    });
    expect(jornadaService.obterKpis).toHaveBeenLastCalledWith(2);
    expect(component.linhas).toHaveLength(1);
  });

  it('representa resposta vazia e erro de listagem', () => {
    jornadaService.listar.mockReturnValueOnce(of(respostaPaginada([])));
    component.carregarDados();
    expect(component.linhas).toEqual([]);
    expect(component.totalRegistros).toBe(0);

    jornadaService.listar.mockReturnValueOnce(throwError(() => new Error('falha')));
    component.carregarDados();
    expect(component.erroCarregamento).toContain('Não foi possível');
    expect(component.carregando).toBe(false);
  });

  it('mantém o loading enquanto a requisição atual está pendente', () => {
    const resposta$ = new Subject<JornadaPaginada>();
    jornadaService.listar.mockReturnValueOnce(resposta$.asObservable());

    component.carregarDados();
    expect(component.carregando).toBe(true);

    resposta$.next(respostaPaginada([]));
    resposta$.complete();
    expect(component.carregando).toBe(false);
  });

  it('cancela a consulta anterior quando uma nova consulta é disparada', () => {
    const antiga$ = new Subject<JornadaPaginada>();
    const recente$ = new Subject<JornadaPaginada>();
    jornadaService.listar
      .mockReturnValueOnce(antiga$.asObservable())
      .mockReturnValueOnce(recente$.asObservable());

    component.carregarDados();
    component.carregarDados();
    antiga$.next(respostaPaginada([criarLinha('Antiga')]));
    recente$.next(respostaPaginada([criarLinha('Recente')]));

    expect(component.linhas[0].pessoa.ds_nome).toBe('Recente');
  });

  it('usa diretamente próxima ação, etapa atual e indicadores de progresso do backend', () => {
    const linha = criarLinha();
    linha.progresso.etapas[0].st_vencida = true;

    expect(component.textoProximaAcao(linha)).toBe('Primeiro contato');
    expect(component.etapaParaEvolucao(linha)).toBe(linha.etapa_atual);
    expect(component.classeEtapa(linha.progresso.etapas[0])).toBe('overdue');

    linha.etapa_atual = null;
    linha.proxima_acao = null;
    expect(component.etapaParaEvolucao(linha)).toBeNull();
    expect(component.textoProximaAcao(linha)).toBe('Sem etapa pendente');
  });

  it('respeita os estados encerrados devolvidos pela API', () => {
    const concluida = criarLinha('Aldo', SituacaoTrajetoria.CONCLUIDA);
    const cancelada = criarLinha('Aldo', SituacaoTrajetoria.CANCELADA);

    expect(component.textoProximaAcao(concluida)).toBe('Jornada concluída');
    expect(component.textoProximaAcao(cancelada)).toBe('Jornada cancelada');
  });

  it('recarrega a página atual e os KPIs após evolução e definição de líder', () => {
    jornadaService.listar.mockClear();
    jornadaService.obterKpis.mockClear();

    component.aoRegistrarEvolucaoSalva();
    component.aoDefinirLiderSalvo();

    expect(jornadaService.listar).toHaveBeenCalledTimes(2);
    expect(jornadaService.obterKpis).toHaveBeenCalledTimes(2);
    expect(component.modalEvolucaoVisivel).toBe(false);
    expect(component.modalLiderVisivel).toBe(false);
  });

  it('não carrega pessoas ou etapas completas no fluxo normal e consulta a configuração só ao evoluir', () => {
    component.aoCarregarTabela({ first: 0, rows: 10, sortField: 'pessoa', sortOrder: 1 });
    expect(pessoaService.listar).not.toHaveBeenCalled();
    expect(trajetoriaEtapaService.buscarPorId).not.toHaveBeenCalled();

    const linha = criarLinha();
    component.abrirModalEvolucao(linha);

    expect(trajetoriaEtapaService.buscarPorId).toHaveBeenCalledWith(60);
    expect(component.modalEvolucaoVisivel).toBe(true);
  });

  it('abre o drawer apenas com a linha agregada', () => {
    const linha = criarLinha();
    component.abrirDetalhes(linha);
    expect(component.linhaDetalhada).toBe(linha);
    expect(component.drawerVisivel).toBe(true);
    expect(pessoaService.listar).not.toHaveBeenCalled();
  });

  it('mantém consulta disponível e bloqueia escrita em filial somente visualizável', () => {
    authService.podeEditarFilial.mockReturnValue(false);
    const linha = criarLinha();

    component.abrirDetalhes(linha);
    component.abrirModalEvolucao(linha);

    expect(component.drawerVisivel).toBe(true);
    expect(component.podeEditarLinha(linha)).toBe(false);
    expect(component.linhaSelecionavel({ data: linha })).toBe(false);
    expect(trajetoriaEtapaService.buscarPorId).not.toHaveBeenCalled();
  });

  it('diferencia liderança visível, ausente e restrita pelo contrato', () => {
    const visivel = criarLinha();
    visivel.lideranca = {
      seq_lider: 9,
      ds_nome: 'Líder Visível',
      sem_lider: false,
      st_lider_restrito: false,
    };
    const ausente = criarLinha();
    const restrita = criarLinha();
    restrita.lideranca = {
      seq_lider: null,
      ds_nome: null,
      sem_lider: false,
      st_lider_restrito: true,
    };

    expect(visivel.lideranca.ds_nome).toBe('Líder Visível');
    expect(ausente.lideranca.sem_lider).toBe(true);
    expect(restrita.lideranca.st_lider_restrito).toBe(true);
    expect(restrita.lideranca.sem_lider).toBe(false);
  });
});

function respostaPaginada(items: JornadaLinha[]): JornadaPaginada {
  return {
    items,
    page: 1,
    page_size: 10,
    total_items: items.length,
    total_pages: items.length ? 1 : 0,
  };
}

function criarLinha(
  nome = 'Aldo',
  situacao: SituacaoTrajetoria = SituacaoTrajetoria.EM_ANDAMENTO,
): JornadaLinha {
  const concluida = situacao === SituacaoTrajetoria.CONCLUIDA;
  const cancelada = situacao === SituacaoTrajetoria.CANCELADA;
  const etapa = {
    seq_pessoa_trajetoria_etapa: 50,
    seq_trajetoria_etapa: 60,
    seq_etapa_trajetoria: 1,
    ds_nome: 'Primeiro contato',
    nr_ordem: 1,
    nu_situacao: SituacaoTrajetoria.EM_ANDAMENTO,
    ds_situacao: 'EM_ANDAMENTO',
    dt_inicio: '2026-07-20',
    dt_conclusao: null,
    ds_observacao: 'Observação atual',
    ds_motivo_pulo: null,
    nr_prazo_dias: 3,
    st_ativo_configuracao: true,
    st_atual: true,
    st_concluida: false,
    st_futura: false,
    st_pulada: false,
    st_cancelada: false,
    st_vencida: false,
  };
  return {
    pessoa: {
      seq_pessoa: 10,
      ds_nome: nome,
      nr_telefone: '61999999999',
      st_ativo: true,
      filial: { seq_filial: 1, ds_nome: 'Sede' },
    },
    jornada: {
      seq_pessoa_trajetoria: 30,
      seq_trajetoria: 40,
      ds_nome: 'Integração',
      nu_situacao: situacao,
      ds_situacao: String(situacao),
      dt_inicio: '2026-07-20',
      dt_conclusao: concluida || cancelada ? '2026-07-25' : null,
      ds_observacao: null,
      st_pausada: false,
      st_cancelada: cancelada,
      st_concluida: concluida,
    },
    lideranca: {
      seq_lider: null,
      ds_nome: null,
      sem_lider: true,
      st_lider_restrito: false,
    },
    etapa_atual: concluida || cancelada ? null : etapa,
    proxima_acao: concluida || cancelada ? null : etapa,
    progresso: {
      total_etapas: 1,
      etapas_concluidas: 0,
      etapas_puladas: 0,
      etapas_canceladas: 0,
      percentual: 0,
      etapas: [etapa],
    },
    dh_ultima_evolucao: null,
  };
}

function criarConfiguracaoEtapa() {
  return {
    seq_trajetoria_etapa: 60,
    seq_trajetoria: 40,
    seq_etapa_trajetoria: 1,
    ds_nome: 'Primeiro contato',
    nr_ordem: 1,
    nr_prazo_dias: 3,
    st_obrigatoria: true,
    st_permite_pular: true,
    st_exige_observacao: false,
    st_ativo: true,
    seq_usuario_inclusao: 1,
    seq_usuario_alteracao: null,
    dh_inclusao: '2026-07-20T10:00:00',
    dh_alteracao: null,
  };
}
