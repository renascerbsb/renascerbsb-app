import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, concatMap, finalize, forkJoin, of } from 'rxjs';

import { DashboardJornada, DashboardService } from '../../services/dashboard.service';
import { Filial, FilialService } from '../../services/filial.service';
import { PessoaLider, PessoaLiderService } from '../../services/pessoa-lider.service';
import {
  PessoaTrajetoriaEtapa,
  PessoaTrajetoriaEtapaService,
} from '../../services/pessoa-trajetoria-etapa.service';
import {
  PessoaTrajetoria,
  PessoaTrajetoriaService,
} from '../../services/pessoa-trajetoria.service';
import { Pessoa, PessoaService } from '../../services/pessoa.service';
import { TrajetoriaEtapa, TrajetoriaEtapaService } from '../../services/trajetoria-etapa.service';
import { Trajetoria, TrajetoriaService } from '../../services/trajetoria.service';
import {
  SITUACOES_TRAJETORIA,
  SituacaoTrajetoria,
} from '../../shared/enums/situacao-trajetoria.enum';

interface Opcao<T> {
  label: string;
  value: T;
  disabled?: boolean;
}

interface EtapaDaJornada {
  modelo: TrajetoriaEtapa;
  acompanhamento: PessoaTrajetoriaEtapa | null;
}

interface JornadaLinha {
  pessoaTrajetoria: PessoaTrajetoria;
  pessoa: Pessoa;
  trajetoria: Trajetoria;
  filial: Filial | null;
  etapas: EtapaDaJornada[];
}

type AbaDrawer = 'resumo' | 'jornada' | 'historico' | 'lideranca';

@Component({
  selector: 'app-jornada',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    DrawerModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule,
    TextareaModule,
    TooltipModule,
  ],
  templateUrl: './jornada.html',
  styleUrl: './jornada.component.scss',
})
export class Jornada implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly filialService = inject(FilialService);
  private readonly pessoaService = inject(PessoaService);
  private readonly pessoaLiderService = inject(PessoaLiderService);
  private readonly pessoaTrajetoriaService = inject(PessoaTrajetoriaService);
  private readonly pessoaTrajetoriaEtapaService = inject(PessoaTrajetoriaEtapaService);
  private readonly trajetoriaService = inject(TrajetoriaService);
  private readonly trajetoriaEtapaService = inject(TrajetoriaEtapaService);
  private readonly messageService = inject(MessageService);

  readonly situacoes: Opcao<SituacaoTrajetoria | null>[] = [
    { label: 'Todas', value: null },
    ...SITUACOES_TRAJETORIA.filter((item) => item.value !== SituacaoTrajetoria.PULADA).map(
      (item) => ({ ...item }),
    ),
  ];
  readonly liderancas: Opcao<string>[] = [
    { label: 'Todas', value: '' },
    { label: 'Com líder', value: 'com' },
    { label: 'Sem líder', value: 'sem' },
  ];
  readonly situacoesJornadaEvolucao: Opcao<SituacaoTrajetoria>[] = SITUACOES_TRAJETORIA.filter(
    (item) => item.value !== SituacaoTrajetoria.PULADA,
  ).map((item) => ({
    ...item,
    disabled: item.value === SituacaoTrajetoria.CONCLUIDA,
  }));

  indicadores: DashboardJornada | null = null;
  pessoas: Pessoa[] = [];
  filiais: Filial[] = [];
  trajetorias: Trajetoria[] = [];
  etapasModelo: TrajetoriaEtapa[] = [];
  etapasPessoas: PessoaTrajetoriaEtapa[] = [];
  linhas: JornadaLinha[] = [];
  selecionadas: JornadaLinha[] = [];
  lideres: Pessoa[] = [];
  carregando = false;
  erroCarregamento = '';

  filtro = this.criarFiltros();
  filtrosAplicados = this.criarFiltros();

  drawerVisivel = false;
  abaDrawer: AbaDrawer = 'resumo';
  linhaDetalhada: JornadaLinha | null = null;
  historico: PessoaTrajetoriaEtapa[] = [];
  historicoLideranca: PessoaLider[] = [];
  carregandoDetalhes = false;

  modalLiderVisivel = false;
  seqNovoLider: number | null = null;
  dataLideranca = this.hoje();
  observacaoLideranca = '';
  salvandoLider = false;

  modalEvolucaoVisivel = false;
  linhaEvolucao: JornadaLinha | null = null;
  etapaEvolucao: EtapaDaJornada | null = null;
  situacaoJornadaEvolucao: SituacaoTrajetoria = SituacaoTrajetoria.NAO_INICIADA;
  dataConclusaoJornadaEvolucao: string | null = null;
  situacaoEtapaEvolucao: SituacaoTrajetoria = SituacaoTrajetoria.NAO_INICIADA;
  dataInicioEtapaEvolucao: string | null = null;
  dataConclusaoEtapaEvolucao: string | null = null;
  observacaoEvolucao = '';
  motivoPulo = '';
  erroEvolucao = '';
  salvandoEvolucao = false;

  ngOnInit(): void {
    this.carregarDados();
  }

  get filiaisOpcoes(): Opcao<number>[] {
    return this.filiais
      .filter((filial) => filial.st_ativo)
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

  get pessoasSelecionadas(): Pessoa[] {
    const unicas = new Map<number, Pessoa>();
    this.selecionadas.forEach((linha) => unicas.set(linha.pessoa.seq_pessoa, linha.pessoa));
    return [...unicas.values()];
  }

  get linhasFiltradas(): JornadaLinha[] {
    const busca = this.normalizar(this.filtrosAplicados.busca);
    const telefone = this.filtrosAplicados.busca.replace(/\D/g, '');

    return this.linhas.filter((linha) => {
      const correspondeBusca =
        !busca ||
        this.normalizar(linha.pessoa.ds_nome).includes(busca) ||
        (!!telefone && (linha.pessoa.nr_telefone ?? '').replace(/\D/g, '').includes(telefone));
      const correspondeFilial =
        !this.filtrosAplicados.seqFilial ||
        linha.pessoa.seq_filial === this.filtrosAplicados.seqFilial;
      const correspondeTrajetoria =
        !this.filtrosAplicados.seqTrajetoria ||
        linha.trajetoria.seq_trajetoria === this.filtrosAplicados.seqTrajetoria;
      const correspondeSituacao =
        !this.filtrosAplicados.nuSituacao ||
        linha.pessoaTrajetoria.nu_situacao === this.filtrosAplicados.nuSituacao;
      const temLider = !!linha.pessoa.lider;
      const correspondeLideranca =
        !this.filtrosAplicados.lideranca ||
        (this.filtrosAplicados.lideranca === 'com' && temLider) ||
        (this.filtrosAplicados.lideranca === 'sem' && !temLider);
      return (
        correspondeBusca &&
        correspondeFilial &&
        correspondeTrajetoria &&
        correspondeSituacao &&
        correspondeLideranca
      );
    });
  }

  get quantidadeSemLider(): number {
    const pessoas = new Set(
      this.linhas
        .filter(
          (linha) =>
            !linha.pessoa.lider &&
            (!this.filtrosAplicados.seqFilial ||
              linha.pessoa.seq_filial === this.filtrosAplicados.seqFilial),
        )
        .map((linha) => linha.pessoa.seq_pessoa),
    );
    return pessoas.size;
  }

  carregarDados(): void {
    this.carregando = true;
    this.erroCarregamento = '';
    forkJoin({
      indicadores: this.dashboardService.obterIndicadoresJornada(this.filtrosAplicados.seqFilial),
      pessoasAtivas: this.pessoaService.listar({ st_ativo: true }),
      pessoasInativas: this.pessoaService.listar({ st_ativo: false }),
      filiais: this.filialService.listar(),
      trajetoriasAtivas: this.trajetoriaService.listar({ st_ativo: true }),
      trajetoriasInativas: this.trajetoriaService.listar({ st_ativo: false }),
      etapasAtivas: this.trajetoriaEtapaService.listar({ st_ativo: true }),
      etapasInativas: this.trajetoriaEtapaService.listar({ st_ativo: false }),
      pessoasTrajetorias: this.pessoaTrajetoriaService.listar(),
      etapasPessoas: this.pessoaTrajetoriaEtapaService.listar(),
    })
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (dados) => {
          this.indicadores = dados.indicadores;
          this.pessoas = this.unirPorId(
            [...dados.pessoasAtivas, ...dados.pessoasInativas],
            (pessoa) => pessoa.seq_pessoa,
          );
          this.lideres = dados.pessoasAtivas.sort((a, b) =>
            a.ds_nome.localeCompare(b.ds_nome, 'pt-BR'),
          );
          this.filiais = dados.filiais;
          this.trajetorias = this.unirPorId(
            [...dados.trajetoriasAtivas, ...dados.trajetoriasInativas],
            (trajetoria) => trajetoria.seq_trajetoria,
          );
          this.etapasModelo = this.unirPorId(
            [...dados.etapasAtivas, ...dados.etapasInativas],
            (etapa) => etapa.seq_trajetoria_etapa,
          );
          this.etapasPessoas = dados.etapasPessoas;
          this.montarLinhas(dados.pessoasTrajetorias);
          this.atualizarDrawerAposRecarga();
        },
        error: () => {
          this.erroCarregamento = 'Não foi possível carregar os dados da Jornada.';
        },
      });
  }

  pesquisar(): void {
    this.filtrosAplicados = { ...this.filtro };
    this.selecionadas = [];
    this.dashboardService
      .obterIndicadoresJornada(this.filtrosAplicados.seqFilial)
      .subscribe((indicadores) => (this.indicadores = indicadores));
  }

  limparFiltros(): void {
    this.filtro = this.criarFiltros();
    this.filtrosAplicados = this.criarFiltros();
    this.selecionadas = [];
    this.dashboardService
      .obterIndicadoresJornada()
      .subscribe((indicadores) => (this.indicadores = indicadores));
  }

  abrirDetalhes(linha: JornadaLinha): void {
    this.linhaDetalhada = linha;
    this.abaDrawer = 'resumo';
    this.drawerVisivel = true;
    this.carregandoDetalhes = true;
    this.historico = [];
    this.historicoLideranca = [];
    forkJoin({
      historico: this.pessoaTrajetoriaService.listarHistorico(
        linha.pessoaTrajetoria.seq_pessoa_trajetoria,
      ),
      liderancasAtivas: this.pessoaLiderService.listar({
        seq_pessoa: linha.pessoa.seq_pessoa,
        st_ativo: true,
      }),
      liderancasInativas: this.pessoaLiderService.listar({
        seq_pessoa: linha.pessoa.seq_pessoa,
        st_ativo: false,
      }),
    })
      .pipe(finalize(() => (this.carregandoDetalhes = false)))
      .subscribe(({ historico, liderancasAtivas, liderancasInativas }) => {
        this.historico = historico.sort(
          (a, b) =>
            this.ordemEtapa(a.seq_trajetoria_etapa) - this.ordemEtapa(b.seq_trajetoria_etapa),
        );
        this.historicoLideranca = [...liderancasAtivas, ...liderancasInativas].sort((a, b) =>
          b.dt_inicio.localeCompare(a.dt_inicio),
        );
      });
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
    this.seqNovoLider = null;
    this.dataLideranca = this.hoje();
    this.observacaoLideranca = '';
    this.modalLiderVisivel = true;
  }

  definirLider(): void {
    if (!this.seqNovoLider) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Revise os dados',
        detail: 'Selecione o novo líder.',
      });
      return;
    }
    if (!this.dataLideranca) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Revise os dados',
        detail: 'Informe a data de início.',
      });
      return;
    }
    this.salvandoLider = true;
    this.pessoaLiderService
      .definirEmLote({
        seq_pessoas: this.pessoasSelecionadas.map((pessoa) => pessoa.seq_pessoa),
        seq_lider: this.seqNovoLider,
        dt_inicio: this.dataLideranca,
        ds_observacao: this.observacaoLideranca.trim() || null,
      })
      .pipe(finalize(() => (this.salvandoLider = false)))
      .subscribe((resultado) => {
        this.modalLiderVisivel = false;
        this.selecionadas = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Liderança definida',
          detail: `Líder definido para ${resultado.quantidade} ${resultado.quantidade === 1 ? 'pessoa' : 'pessoas'}.`,
        });
        this.carregarDados();
      });
  }

  abrirModalEvolucao(linha: JornadaLinha): void {
    const etapa = this.etapaParaEvolucao(linha);
    if (!etapa?.acompanhamento) {
      return;
    }
    this.linhaEvolucao = linha;
    this.etapaEvolucao = etapa;
    this.situacaoJornadaEvolucao = linha.pessoaTrajetoria.nu_situacao;
    this.dataConclusaoJornadaEvolucao = linha.pessoaTrajetoria.dt_conclusao;
    this.situacaoEtapaEvolucao = etapa.acompanhamento.nu_situacao;
    this.dataInicioEtapaEvolucao = etapa.acompanhamento.dt_inicio;
    this.dataConclusaoEtapaEvolucao = etapa.acompanhamento.dt_conclusao;
    this.observacaoEvolucao = etapa.acompanhamento.ds_observacao ?? '';
    this.motivoPulo = etapa.acompanhamento.ds_motivo_pulo ?? '';
    this.erroEvolucao = '';
    this.modalEvolucaoVisivel = true;
  }

  registrarEvolucao(): void {
    const linha = this.linhaEvolucao;
    const etapa = this.etapaEvolucao;
    if (!linha || !etapa?.acompanhamento) {
      return;
    }
    if (this.modoConsultaEvolucao || !this.validarEvolucao()) {
      return;
    }

    const etapaAlterada = this.etapaFoiAlterada;
    const jornadaAlterada = this.jornadaFoiAlterada;
    if (!etapaAlterada && !jornadaAlterada) {
      this.exibirValidacaoEvolucao('Nenhuma alteração foi informada.');
      return;
    }

    this.salvandoEvolucao = true;
    this.salvarEtapaAtual(linha, etapa, etapaAlterada)
      .pipe(concatMap(() => this.salvarSituacaoJornada(linha, jornadaAlterada)))
      .pipe(finalize(() => (this.salvandoEvolucao = false)))
      .subscribe({
        next: () => {
          this.modalEvolucaoVisivel = false;
          this.messageService.add({
            severity: 'success',
            summary: etapaAlterada ? 'Evolução registrada' : 'Jornada atualizada',
            detail:
              etapaAlterada && jornadaAlterada
                ? 'Jornada e etapa atualizadas com sucesso.'
                : etapaAlterada
                  ? 'Evolução registrada com sucesso.'
                  : 'Situação da jornada atualizada com sucesso.',
          });
          this.carregarDados();
        },
        error: (erro: HttpErrorResponse) => {
          this.erroEvolucao = this.obterMensagemErro(erro);
          this.messageService.add({
            severity: 'error',
            summary: 'Não foi possível registrar a evolução',
            detail: this.erroEvolucao,
          });
        },
      });
  }

  get modoConsultaEvolucao(): boolean {
    return !!this.linhaEvolucao && this.jornadaEncerrada(this.linhaEvolucao);
  }

  get jornadaFoiAlterada(): boolean {
    return (
      !!this.linhaEvolucao &&
      this.situacaoJornadaEvolucao !== this.linhaEvolucao.pessoaTrajetoria.nu_situacao
    );
  }

  get etapaFoiAlterada(): boolean {
    const atual = this.etapaEvolucao?.acompanhamento;
    return (
      !!atual &&
      (this.situacaoEtapaEvolucao !== atual.nu_situacao ||
        this.dataInicioEtapaEvolucao !== atual.dt_inicio ||
        this.dataConclusaoEtapaEvolucao !== atual.dt_conclusao ||
        this.observacaoEvolucao.trim() !== (atual.ds_observacao ?? '') ||
        (this.situacaoEtapaEvolucao === SituacaoTrajetoria.PULADA
          ? this.motivoPulo.trim() !== (atual.ds_motivo_pulo ?? '')
          : !!atual.ds_motivo_pulo))
    );
  }

  get podeEditarDataInicioEtapa(): boolean {
    const situacaoAtual = this.etapaEvolucao?.acompanhamento?.nu_situacao;
    return (
      !this.modoConsultaEvolucao &&
      !this.salvandoEvolucao &&
      (this.situacaoEtapaEvolucao === situacaoAtual ||
        this.situacaoEtapaEvolucao === SituacaoTrajetoria.EM_ANDAMENTO)
    );
  }

  get situacoesEtapaEvolucao(): Opcao<SituacaoTrajetoria>[] {
    const atual = this.etapaEvolucao?.acompanhamento?.nu_situacao;
    if (!atual) {
      return [];
    }
    const transicoes: Partial<Record<SituacaoTrajetoria, SituacaoTrajetoria[]>> = {
      [SituacaoTrajetoria.NAO_INICIADA]: [
        SituacaoTrajetoria.EM_ANDAMENTO,
        SituacaoTrajetoria.CONCLUIDA,
        SituacaoTrajetoria.CANCELADA,
        SituacaoTrajetoria.PULADA,
      ],
      [SituacaoTrajetoria.EM_ANDAMENTO]: [
        SituacaoTrajetoria.PAUSADA,
        SituacaoTrajetoria.CONCLUIDA,
        SituacaoTrajetoria.CANCELADA,
        SituacaoTrajetoria.PULADA,
      ],
      [SituacaoTrajetoria.PAUSADA]: [
        SituacaoTrajetoria.EM_ANDAMENTO,
        SituacaoTrajetoria.CANCELADA,
        SituacaoTrajetoria.PULADA,
      ],
    };
    const permitidas = new Set([atual, ...(transicoes[atual] ?? [])]);
    return SITUACOES_TRAJETORIA.filter((item) => permitidas.has(item.value)).map((item) => ({
      ...item,
      disabled:
        item.value === SituacaoTrajetoria.PULADA && !this.etapaEvolucao?.modelo.st_permite_pular,
    }));
  }

  etapaParaEvolucao(linha: JornadaLinha): EtapaDaJornada | null {
    const etapaAberta = linha.etapas.find(
      (etapa) => !!etapa.acompanhamento && !this.etapaEncerrada(etapa.acompanhamento),
    );
    if (!this.jornadaEncerrada(linha)) {
      return etapaAberta ?? null;
    }
    if (linha.pessoaTrajetoria.nu_situacao === SituacaoTrajetoria.CANCELADA) {
      return (
        linha.etapas.find(
          (etapa) => etapa.acompanhamento?.nu_situacao === SituacaoTrajetoria.CANCELADA,
        ) ??
        etapaAberta ??
        null
      );
    }
    return (
      [...linha.etapas].reverse().find((etapa) => this.etapaEncerrada(etapa.acompanhamento)) ?? null
    );
  }

  private validarEvolucao(): boolean {
    const etapa = this.etapaEvolucao;
    if (!etapa?.acompanhamento) {
      return false;
    }
    const situacao = this.situacaoEtapaEvolucao;
    const iniciada = [SituacaoTrajetoria.EM_ANDAMENTO, SituacaoTrajetoria.PAUSADA].includes(
      situacao,
    );
    const encerrada = [
      SituacaoTrajetoria.CONCLUIDA,
      SituacaoTrajetoria.CANCELADA,
      SituacaoTrajetoria.PULADA,
    ].includes(situacao);
    if (iniciada && !this.dataInicioEtapaEvolucao) {
      return this.exibirValidacaoEvolucao('Informe a data de início da etapa.');
    }
    if (encerrada && !this.dataConclusaoEtapaEvolucao) {
      return this.exibirValidacaoEvolucao('Informe a data de conclusão da etapa.');
    }
    if (
      this.dataInicioEtapaEvolucao &&
      this.dataConclusaoEtapaEvolucao &&
      this.dataConclusaoEtapaEvolucao < this.dataInicioEtapaEvolucao
    ) {
      return this.exibirValidacaoEvolucao(
        'A data de conclusão deve ser igual ou posterior à data de início.',
      );
    }
    if (situacao === SituacaoTrajetoria.PULADA && !this.motivoPulo.trim()) {
      return this.exibirValidacaoEvolucao('Informe o motivo do pulo.');
    }
    if (
      etapa.modelo.st_exige_observacao &&
      [SituacaoTrajetoria.CONCLUIDA, SituacaoTrajetoria.PULADA].includes(situacao) &&
      !this.observacaoEvolucao.trim()
    ) {
      return this.exibirValidacaoEvolucao('Esta etapa exige uma observação.');
    }
    if (
      this.jornadaFoiAlterada &&
      [SituacaoTrajetoria.CONCLUIDA, SituacaoTrajetoria.CANCELADA].includes(
        this.situacaoJornadaEvolucao,
      ) &&
      !this.dataConclusaoJornadaEvolucao
    ) {
      return this.exibirValidacaoEvolucao('Informe a data de conclusão da jornada.');
    }
    return true;
  }

  private salvarEtapaAtual(
    linha: JornadaLinha,
    etapa: EtapaDaJornada,
    alterada: boolean,
  ): Observable<unknown> {
    const acompanhamento = etapa.acompanhamento!;
    if (!alterada) {
      return of(null);
    }
    if (this.situacaoEtapaEvolucao !== acompanhamento.nu_situacao) {
      const dataEvento =
        this.situacaoEtapaEvolucao === SituacaoTrajetoria.EM_ANDAMENTO
          ? this.dataInicioEtapaEvolucao
          : (this.dataConclusaoEtapaEvolucao ?? this.dataInicioEtapaEvolucao);
      if (!dataEvento) {
        return of(null);
      }
      return this.pessoaTrajetoriaService.registrarEvolucao(
        linha.pessoaTrajetoria.seq_pessoa_trajetoria,
        {
          seq_pessoa_trajetoria_etapa: acompanhamento.seq_pessoa_trajetoria_etapa,
          nu_situacao: this.situacaoEtapaEvolucao,
          dt_evento: dataEvento,
          ds_observacao: this.observacaoEvolucao.trim() || null,
          ds_motivo_pulo:
            this.situacaoEtapaEvolucao === SituacaoTrajetoria.PULADA
              ? this.motivoPulo.trim()
              : null,
        },
      );
    }
    return this.pessoaTrajetoriaEtapaService.atualizar(acompanhamento.seq_pessoa_trajetoria_etapa, {
      seq_pessoa_trajetoria: acompanhamento.seq_pessoa_trajetoria,
      seq_trajetoria_etapa: acompanhamento.seq_trajetoria_etapa,
      nu_situacao: this.situacaoEtapaEvolucao,
      dt_inicio: this.dataInicioEtapaEvolucao,
      dt_conclusao: this.dataConclusaoEtapaEvolucao,
      ds_observacao: this.observacaoEvolucao.trim() || null,
      ds_motivo_pulo:
        this.situacaoEtapaEvolucao === SituacaoTrajetoria.PULADA ? this.motivoPulo.trim() : null,
    });
  }

  private salvarSituacaoJornada(
    linha: JornadaLinha,
    alterada: boolean,
  ): Observable<PessoaTrajetoria | null> {
    if (!alterada) {
      return of(null);
    }
    const encerrada = [SituacaoTrajetoria.CONCLUIDA, SituacaoTrajetoria.CANCELADA].includes(
      this.situacaoJornadaEvolucao,
    );
    return this.pessoaTrajetoriaService.atualizar(linha.pessoaTrajetoria.seq_pessoa_trajetoria, {
      seq_pessoa: linha.pessoaTrajetoria.seq_pessoa,
      seq_trajetoria: linha.pessoaTrajetoria.seq_trajetoria,
      nu_situacao: this.situacaoJornadaEvolucao,
      dt_inicio: linha.pessoaTrajetoria.dt_inicio,
      dt_conclusao: encerrada ? this.dataConclusaoJornadaEvolucao : null,
      ds_observacao: linha.pessoaTrajetoria.ds_observacao,
    });
  }

  private exibirValidacaoEvolucao(detalhe: string): false {
    this.messageService.add({ severity: 'warn', summary: 'Revise os dados', detail: detalhe });
    return false;
  }

  private obterMensagemErro(erro: HttpErrorResponse): string {
    if (typeof erro.error?.detail === 'string' && erro.error.detail.trim()) {
      return erro.error.detail;
    }
    if (Array.isArray(erro.error?.detail)) {
      const mensagens = erro.error.detail
        .map((item: { msg?: unknown }) => (typeof item?.msg === 'string' ? item.msg : ''))
        .filter(Boolean);
      if (mensagens.length) {
        return mensagens.join(' ');
      }
    }
    return 'Não foi possível salvar as alterações. Tente novamente.';
  }

  proximaEtapa(linha: JornadaLinha): EtapaDaJornada | null {
    if (this.jornadaEncerrada(linha)) {
      return null;
    }
    return linha.etapas.find((etapa) => !this.etapaEncerrada(etapa.acompanhamento)) ?? null;
  }

  textoProximaAcao(linha: JornadaLinha): string {
    if (linha.pessoaTrajetoria.nu_situacao === SituacaoTrajetoria.CONCLUIDA) {
      return 'Jornada concluída';
    }
    if (linha.pessoaTrajetoria.nu_situacao === SituacaoTrajetoria.CANCELADA) {
      return 'Jornada cancelada';
    }
    return this.proximaEtapa(linha)?.modelo.ds_nome ?? 'Sem etapa pendente';
  }

  nomeSituacao(situacao: SituacaoTrajetoria): string {
    return SITUACOES_TRAJETORIA.find((item) => item.value === situacao)?.label ?? '-';
  }

  severidadeSituacao(
    situacao: SituacaoTrajetoria,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const mapa: Record<SituacaoTrajetoria, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      [SituacaoTrajetoria.NAO_INICIADA]: 'secondary',
      [SituacaoTrajetoria.EM_ANDAMENTO]: 'info',
      [SituacaoTrajetoria.PAUSADA]: 'warn',
      [SituacaoTrajetoria.CONCLUIDA]: 'success',
      [SituacaoTrajetoria.CANCELADA]: 'danger',
      [SituacaoTrajetoria.PULADA]: 'secondary',
    };
    return mapa[situacao];
  }

  classeEtapa(etapa: EtapaDaJornada, linha: JornadaLinha): string {
    const situacao = etapa.acompanhamento?.nu_situacao;
    if (situacao === SituacaoTrajetoria.CONCLUIDA || situacao === SituacaoTrajetoria.PULADA) {
      return 'done';
    }
    if (this.etapaVencida(etapa)) {
      return 'overdue';
    }
    if (
      this.proximaEtapa(linha)?.modelo.seq_trajetoria_etapa === etapa.modelo.seq_trajetoria_etapa
    ) {
      return situacao === SituacaoTrajetoria.PAUSADA ? 'paused' : 'current';
    }
    if (situacao === SituacaoTrajetoria.CANCELADA) {
      return 'cancelled';
    }
    return '';
  }

  tooltipEtapa(etapa: EtapaDaJornada): string {
    const situacao = etapa.acompanhamento
      ? this.nomeSituacao(etapa.acompanhamento.nu_situacao)
      : 'Sem acompanhamento';
    return `${etapa.modelo.ds_nome} · ${situacao}${this.etapaVencida(etapa) ? ' · Prazo vencido' : ''}`;
  }

  nomeLider(seqLider: number): string {
    return (
      this.pessoas.find((pessoa) => pessoa.seq_pessoa === seqLider)?.ds_nome ??
      'Líder não encontrado'
    );
  }

  nomeEtapa(seqEtapa: number): string {
    return (
      this.etapasModelo.find((etapa) => etapa.seq_trajetoria_etapa === seqEtapa)?.ds_nome ?? 'Etapa'
    );
  }

  formatarTelefone(pessoa: Pessoa): string {
    return this.pessoaService.formatarTelefone(pessoa) || 'Sem telefone';
  }

  jornadaEncerrada(linha: JornadaLinha): boolean {
    return [SituacaoTrajetoria.CONCLUIDA, SituacaoTrajetoria.CANCELADA].includes(
      linha.pessoaTrajetoria.nu_situacao,
    );
  }

  private montarLinhas(pessoasTrajetorias: PessoaTrajetoria[]): void {
    const pessoas = new Map(this.pessoas.map((pessoa) => [pessoa.seq_pessoa, pessoa]));
    const trajetorias = new Map(
      this.trajetorias.map((trajetoria) => [trajetoria.seq_trajetoria, trajetoria]),
    );
    const filiais = new Map(this.filiais.map((filial) => [filial.seq_filial, filial]));
    const acompanhamentos = new Map(
      this.etapasPessoas.map((etapa) => [
        `${etapa.seq_pessoa_trajetoria}:${etapa.seq_trajetoria_etapa}`,
        etapa,
      ]),
    );

    this.linhas = pessoasTrajetorias
      .map((pessoaTrajetoria): JornadaLinha | null => {
        const pessoa = pessoas.get(pessoaTrajetoria.seq_pessoa);
        const trajetoria = trajetorias.get(pessoaTrajetoria.seq_trajetoria);
        if (!pessoa || !trajetoria) {
          return null;
        }
        const etapas = this.etapasModelo
          .filter((etapa) => {
            const chave = `${pessoaTrajetoria.seq_pessoa_trajetoria}:${etapa.seq_trajetoria_etapa}`;
            return (
              etapa.seq_trajetoria === trajetoria.seq_trajetoria &&
              (etapa.st_ativo || acompanhamentos.has(chave))
            );
          })
          .sort((a, b) => a.nr_ordem - b.nr_ordem)
          .map((modelo) => ({
            modelo,
            acompanhamento:
              acompanhamentos.get(
                `${pessoaTrajetoria.seq_pessoa_trajetoria}:${modelo.seq_trajetoria_etapa}`,
              ) ?? null,
          }));
        return {
          pessoaTrajetoria,
          pessoa,
          trajetoria,
          filial: pessoa.seq_filial ? (filiais.get(pessoa.seq_filial) ?? null) : null,
          etapas,
        };
      })
      .filter((linha): linha is JornadaLinha => !!linha);
  }

  private atualizarDrawerAposRecarga(): void {
    const seqPessoaTrajetoria = this.linhaDetalhada?.pessoaTrajetoria.seq_pessoa_trajetoria;
    if (!seqPessoaTrajetoria) {
      return;
    }
    this.linhaDetalhada =
      this.linhas.find(
        (linha) => linha.pessoaTrajetoria.seq_pessoa_trajetoria === seqPessoaTrajetoria,
      ) ?? null;
    if (!this.drawerVisivel || !this.linhaDetalhada) {
      return;
    }
    this.pessoaTrajetoriaService
      .listarHistorico(seqPessoaTrajetoria)
      .subscribe(
        (historico) =>
          (this.historico = historico.sort(
            (a, b) =>
              this.ordemEtapa(a.seq_trajetoria_etapa) - this.ordemEtapa(b.seq_trajetoria_etapa),
          )),
      );
  }

  private etapaEncerrada(etapa: PessoaTrajetoriaEtapa | null): boolean {
    return (
      !!etapa &&
      [SituacaoTrajetoria.CONCLUIDA, SituacaoTrajetoria.PULADA].includes(etapa.nu_situacao)
    );
  }

  private etapaVencida(etapa: EtapaDaJornada): boolean {
    const acompanhamento = etapa.acompanhamento;
    const prazo = etapa.modelo.nr_prazo_dias;
    if (
      !acompanhamento?.dt_inicio ||
      acompanhamento.nu_situacao !== SituacaoTrajetoria.EM_ANDAMENTO ||
      prazo === null ||
      prazo === undefined ||
      prazo < 0
    ) {
      return false;
    }
    const vencimento = new Date(`${acompanhamento.dt_inicio}T00:00:00`);
    vencimento.setDate(vencimento.getDate() + prazo);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return hoje > vencimento;
  }

  private ordemEtapa(seqEtapa: number): number {
    return (
      this.etapasModelo.find((etapa) => etapa.seq_trajetoria_etapa === seqEtapa)?.nr_ordem ??
      Number.MAX_SAFE_INTEGER
    );
  }

  private criarFiltros() {
    return {
      busca: '',
      seqFilial: null as number | null,
      seqTrajetoria: null as number | null,
      nuSituacao: null as SituacaoTrajetoria | null,
      lideranca: '',
    };
  }

  private normalizar(valor: string): string {
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pt-BR')
      .trim();
  }

  private hoje(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  private unirPorId<T>(itens: T[], obterId: (item: T) => number): T[] {
    return [...new Map(itens.map((item) => [obterId(item), item])).values()];
  }
}
