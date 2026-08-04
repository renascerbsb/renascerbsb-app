import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, catchError, map, of, switchMap, tap } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { FilialGestao, FilialService } from '../../services/filial.service';
import {
  JornadaConsultaParams,
  JornadaDirecaoOrdenacao,
  JornadaKpis,
  JornadaOrdenacao,
  JornadaService,
} from '../../services/jornada.service';
import { Pessoa, PessoaService } from '../../services/pessoa.service';
import { TrajetoriaEtapa, TrajetoriaEtapaService } from '../../services/trajetoria-etapa.service';
import { Trajetoria, TrajetoriaService } from '../../services/trajetoria.service';
import {
  SITUACOES_TRAJETORIA,
  SituacaoTrajetoria,
} from '../../shared/enums/situacao-trajetoria.enum';
import { DefinirLiderDialog } from './components/definir-lider-dialog/definir-lider-dialog';
import { DetalheJornadaDrawer } from './components/detalhe-jornada-drawer/detalhe-jornada-drawer';
import { RegistrarEvolucaoDialog } from './components/registrar-evolucao-dialog/registrar-evolucao-dialog';
import { EtapaDaJornada, JornadaLinha } from './interfaces/jornada.models';
import {
  classeEtapa,
  etapaParaEvolucao,
  jornadaEncerrada,
  nomeSituacao,
  severidadeSituacao,
  textoProximaAcao,
  tooltipEtapa,
} from './jornada.helpers';

interface Opcao<T> {
  label: string;
  value: T;
  disabled?: boolean;
}

interface FiltrosJornada {
  busca: string;
  seqFilial: number | null;
  seqTrajetoria: number | null;
  nuSituacao: SituacaoTrajetoria | null;
  lideranca: '' | 'com' | 'sem';
}

@Component({
  selector: 'app-jornada',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule,
    TooltipModule,
    DefinirLiderDialog,
    DetalheJornadaDrawer,
    RegistrarEvolucaoDialog,
  ],
  templateUrl: './jornada.html',
  styleUrl: './jornada.component.scss',
})
export class Jornada implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly filialService = inject(FilialService);
  private readonly jornadaService = inject(JornadaService);
  private readonly pessoaService = inject(PessoaService);
  private readonly trajetoriaService = inject(TrajetoriaService);
  private readonly trajetoriaEtapaService = inject(TrajetoriaEtapaService);
  private readonly messageService = inject(MessageService);
  private readonly consultas$ = new Subject<JornadaConsultaParams>();
  private readonly consultasKpis$ = new Subject<number | null>();

  readonly situacoes: Opcao<SituacaoTrajetoria | null>[] = [
    { label: 'Todas', value: null },
    ...SITUACOES_TRAJETORIA.filter((item) => item.value !== SituacaoTrajetoria.PULADA).map(
      (item) => ({ ...item }),
    ),
  ];
  readonly liderancas: Opcao<FiltrosJornada['lideranca']>[] = [
    { label: 'Todas', value: '' },
    { label: 'Com líder', value: 'com' },
    { label: 'Sem líder', value: 'sem' },
  ];

  indicadores: JornadaKpis | null = null;
  filiais: FilialGestao[] = [];
  trajetorias: Trajetoria[] = [];
  linhas: JornadaLinha[] = [];
  selecionadas: JornadaLinha[] = [];
  lideres: Pessoa[] = [];
  carregando = false;
  carregandoKpis = false;
  erroCarregamento = '';
  erroKpis = '';
  totalRegistros = 0;
  primeiroRegistro = 0;
  carregandoFiliais = false;
  erroFiliais = '';

  filtro = this.criarFiltros();
  filtrosAplicados = this.criarFiltros();
  consulta: JornadaConsultaParams = {
    page: 1,
    pageSize: 10,
    sort: 'pessoa',
    order: 'asc',
  };

  drawerVisivel = false;
  linhaDetalhada: JornadaLinha | null = null;
  modalLiderVisivel = false;
  modalEvolucaoVisivel = false;
  linhaEvolucao: JornadaLinha | null = null;
  etapaEvolucao: EtapaDaJornada | null = null;
  configuracaoEtapaEvolucao: TrajetoriaEtapa | null = null;

  ngOnInit(): void {
    this.configurarConsultas();
    this.carregarFiltros();
    this.carregarKpis();
    this.authService.atualizarUsuario().subscribe({ error: () => undefined });
  }

  get filiaisOpcoes(): Opcao<number>[] {
    return this.filiais
      .filter(
        (filial) =>
          filial.st_ativo &&
          filial.st_visualiza &&
          this.authService.podeVisualizarFilial(filial.seq_filial),
      )
      .map((filial) => ({ label: filial.ds_nome, value: filial.seq_filial }));
  }

  get trajetoriasOpcoes(): Opcao<number>[] {
    return this.trajetorias.map((trajetoria) => ({
      label: trajetoria.ds_nome,
      value: trajetoria.seq_trajetoria,
    }));
  }

  get lideresOpcoes(): Pessoa[] {
    const selecionados = new Set(this.pessoasSelecionadas.map((pessoa) => pessoa.seq_pessoa));
    return this.lideres.filter((lider) => !selecionados.has(lider.seq_pessoa));
  }

  get pessoasSelecionadas() {
    return [
      ...new Map(
        this.selecionadas.map((linha) => [linha.pessoa.seq_pessoa, linha.pessoa]),
      ).values(),
    ];
  }

  get podeDefinirLider(): boolean {
    return (
      this.selecionadas.length > 0 &&
      this.selecionadas.every((linha) => this.podeEditarLinha(linha))
    );
  }

  get semFiliaisVisualizaveis(): boolean {
    return !this.carregandoFiliais && !this.erroFiliais && this.filiaisOpcoes.length === 0;
  }

  carregarDados(): void {
    this.consultas$.next({ ...this.consulta });
  }

  aoCarregarTabela(evento: TableLazyLoadEvent): void {
    const pageSize = evento.rows ?? this.consulta.pageSize;
    const sort = this.ordenacaoValida(evento.sortField) ?? this.consulta.sort ?? 'pessoa';
    const order: JornadaDirecaoOrdenacao = evento.sortOrder === -1 ? 'desc' : 'asc';
    const ordenacaoMudou = sort !== this.consulta.sort || order !== this.consulta.order;
    const primeiro = ordenacaoMudou ? 0 : (evento.first ?? 0);

    this.primeiroRegistro = primeiro;
    this.consulta = {
      ...this.consulta,
      page: this.converterPaginaPrimeParaApi(primeiro, pageSize),
      pageSize,
      sort,
      order,
    };
    this.carregarDados();
  }

  pesquisar(): void {
    this.filtrosAplicados = { ...this.filtro };
    this.aplicarFiltrosNaConsulta();
    this.selecionadas = [];
    this.primeiroRegistro = 0;
    this.carregarDados();
    this.carregarKpis();
  }

  limparFiltros(): void {
    this.filtro = this.criarFiltros();
    this.filtrosAplicados = this.criarFiltros();
    this.aplicarFiltrosNaConsulta();
    this.selecionadas = [];
    this.primeiroRegistro = 0;
    this.carregarDados();
    this.carregarKpis();
  }

  abrirDetalhes(linha: JornadaLinha): void {
    this.linhaDetalhada = linha;
    this.drawerVisivel = true;
  }

  abrirModalLider(): void {
    if (!this.pessoasSelecionadas.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Seleção necessária',
        detail: 'Selecione pelo menos uma pessoa para definir o líder.',
      });
      return;
    }
    if (!this.selecionadas.every((linha) => this.podeEditarLinha(linha))) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ação indisponível',
        detail: 'Você possui permissão apenas para visualizar uma das filiais selecionadas.',
      });
      return;
    }
    if (this.lideres.length) {
      this.modalLiderVisivel = true;
      return;
    }
    this.pessoaService.listar({ st_ativo: true }).subscribe({
      next: (lideres) => {
        this.lideres = [...lideres].sort((a, b) => a.ds_nome.localeCompare(b.ds_nome, 'pt-BR'));
        this.modalLiderVisivel = true;
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Não foi possível carregar os líderes',
          detail: 'Tente novamente antes de definir a liderança.',
        }),
    });
  }

  aoDefinirLiderSalvo(): void {
    this.modalLiderVisivel = false;
    this.selecionadas = [];
    this.recarregarDadosCanonicos();
  }

  abrirModalEvolucao(linha: JornadaLinha): void {
    if (!this.podeEditarLinha(linha)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ação indisponível',
        detail: this.tooltipSemEdicao(),
      });
      return;
    }
    const etapa = this.etapaParaEvolucao(linha);
    if (!etapa) {
      return;
    }
    this.trajetoriaEtapaService.buscarPorId(etapa.seq_trajetoria_etapa).subscribe({
      next: (configuracao) => {
        this.linhaEvolucao = linha;
        this.etapaEvolucao = etapa;
        this.configuracaoEtapaEvolucao = configuracao;
        this.modalEvolucaoVisivel = true;
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Não foi possível abrir a evolução',
          detail: 'A configuração da etapa atual não pôde ser carregada.',
        }),
    });
  }

  aoRegistrarEvolucaoSalva(): void {
    this.modalEvolucaoVisivel = false;
    this.recarregarDadosCanonicos();
  }

  readonly etapaParaEvolucao = etapaParaEvolucao;
  readonly textoProximaAcao = textoProximaAcao;
  readonly nomeSituacao = nomeSituacao;
  readonly severidadeSituacao = severidadeSituacao;
  readonly classeEtapa = classeEtapa;
  readonly tooltipEtapa = tooltipEtapa;
  readonly jornadaEncerrada = jornadaEncerrada;

  formatarTelefone(telefone: string | null): string {
    return this.pessoaService.formatarTelefone(telefone) || 'Sem telefone';
  }

  podeEditarLinha(linha: JornadaLinha | null): boolean {
    return this.authService.podeEditarFilial(linha?.pessoa.filial?.seq_filial);
  }

  readonly linhaSelecionavel = ({ data }: { data: JornadaLinha }) => this.podeEditarLinha(data);

  tooltipSemEdicao(): string {
    return 'Você possui permissão apenas para visualizar esta filial.';
  }

  private configurarConsultas(): void {
    this.consultas$
      .pipe(
        tap(() => {
          this.carregando = true;
          this.erroCarregamento = '';
        }),
        switchMap((parametros) =>
          this.jornadaService.listar(parametros).pipe(
            map((dados) => ({ dados, erro: '' })),
            catchError(() =>
              of({ dados: null, erro: 'Não foi possível carregar os dados da Jornada.' }),
            ),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ dados, erro }) => {
        this.carregando = false;
        this.erroCarregamento = erro;
        if (!dados) {
          this.linhas = [];
          this.totalRegistros = 0;
          return;
        }
        this.linhas = dados.items;
        this.totalRegistros = dados.total_items;
        this.consulta = { ...this.consulta, page: dados.page, pageSize: dados.page_size };
        this.atualizarDrawerAposRecarga();
      });

    this.consultasKpis$
      .pipe(
        tap(() => {
          this.carregandoKpis = true;
          this.erroKpis = '';
        }),
        switchMap((seqFilial) =>
          this.jornadaService.obterKpis(seqFilial).pipe(
            map((dados) => ({ dados, erro: '' })),
            catchError(() =>
              of({ dados: null, erro: 'Não foi possível carregar os indicadores.' }),
            ),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ dados, erro }) => {
        this.carregandoKpis = false;
        this.erroKpis = erro;
        this.indicadores = dados;
      });
  }

  private carregarFiltros(): void {
    this.carregandoFiliais = true;
    this.erroFiliais = '';
    this.filialService
      .listarGestao()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (filiais) => {
          this.filiais = filiais;
          this.carregandoFiliais = false;
        },
        error: () => {
          this.carregandoFiliais = false;
          this.erroFiliais = 'Não foi possível carregar as filiais disponíveis.';
        },
      });
    this.trajetoriaService
      .listar()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((trajetorias) => (this.trajetorias = trajetorias));
  }

  private carregarKpis(): void {
    this.consultasKpis$.next(this.filtrosAplicados.seqFilial);
  }

  private recarregarDadosCanonicos(): void {
    this.carregarDados();
    this.carregarKpis();
  }

  private aplicarFiltrosNaConsulta(): void {
    const semLider =
      this.filtrosAplicados.lideranca === ''
        ? undefined
        : this.filtrosAplicados.lideranca === 'sem';
    this.consulta = {
      ...this.consulta,
      page: 1,
      pesquisa: this.filtrosAplicados.busca.trim() || undefined,
      seqFilial: this.filtrosAplicados.seqFilial ?? undefined,
      seqTrajetoria: this.filtrosAplicados.seqTrajetoria ?? undefined,
      nuSituacao: this.filtrosAplicados.nuSituacao ?? undefined,
      semLider,
    };
  }

  private converterPaginaPrimeParaApi(primeiro: number, quantidade: number): number {
    return Math.floor(primeiro / quantidade) + 1;
  }

  private ordenacaoValida(campo: string | string[] | null | undefined): JornadaOrdenacao | null {
    if (typeof campo !== 'string') {
      return null;
    }
    const permitidas: readonly JornadaOrdenacao[] = [
      'pessoa',
      'trajetoria',
      'situacao',
      'lider',
      'proxima_acao',
      'dt_inicio',
      'dh_ultima_evolucao',
    ];
    return permitidas.includes(campo as JornadaOrdenacao) ? (campo as JornadaOrdenacao) : null;
  }

  private atualizarDrawerAposRecarga(): void {
    const id = this.linhaDetalhada?.jornada.seq_pessoa_trajetoria;
    if (!id) {
      return;
    }
    this.linhaDetalhada =
      this.linhas.find((linha) => linha.jornada.seq_pessoa_trajetoria === id) ?? null;
    if (!this.linhaDetalhada) {
      this.drawerVisivel = false;
    }
  }

  private criarFiltros(): FiltrosJornada {
    return {
      busca: '',
      seqFilial: null,
      seqTrajetoria: null,
      nuSituacao: null,
      lideranca: '',
    };
  }
}
