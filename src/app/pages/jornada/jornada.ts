import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { finalize, forkJoin } from 'rxjs';

import { DashboardJornada, DashboardService } from '../../services/dashboard.service';
import { Filial, FilialService } from '../../services/filial.service';
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
import { DefinirLiderDialog } from './components/definir-lider-dialog/definir-lider-dialog';
import { DetalheJornadaDrawer } from './components/detalhe-jornada-drawer/detalhe-jornada-drawer';
import { RegistrarEvolucaoDialog } from './components/registrar-evolucao-dialog/registrar-evolucao-dialog';
import { EtapaDaJornada, JornadaLinha } from './interfaces/jornada.models';
import {
  classeEtapa,
  etapaParaEvolucao,
  jornadaEncerrada,
  nomeSituacao,
  proximaEtapa,
  severidadeSituacao,
  textoProximaAcao,
  tooltipEtapa,
} from './jornada.helpers';

interface Opcao<T> {
  label: string;
  value: T;
  disabled?: boolean;
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
  private readonly dashboardService = inject(DashboardService);
  private readonly filialService = inject(FilialService);
  private readonly pessoaService = inject(PessoaService);
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
  linhaDetalhada: JornadaLinha | null = null;

  modalLiderVisivel = false;

  modalEvolucaoVisivel = false;
  linhaEvolucao: JornadaLinha | null = null;
  etapaEvolucao: EtapaDaJornada | null = null;

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
    this.modalLiderVisivel = true;
  }

  aoDefinirLiderSalvo(): void {
    this.modalLiderVisivel = false;
    this.selecionadas = [];
    this.carregarDados();
  }

  abrirModalEvolucao(linha: JornadaLinha): void {
    const etapa = this.etapaParaEvolucao(linha);
    if (!etapa?.acompanhamento) {
      return;
    }
    this.linhaEvolucao = linha;
    this.etapaEvolucao = etapa;
    this.modalEvolucaoVisivel = true;
  }

  aoRegistrarEvolucaoSalva(): void {
    this.modalEvolucaoVisivel = false;
    this.carregarDados();
  }

  readonly etapaParaEvolucao = etapaParaEvolucao;
  readonly proximaEtapa = proximaEtapa;
  readonly textoProximaAcao = textoProximaAcao;
  readonly nomeSituacao = nomeSituacao;
  readonly severidadeSituacao = severidadeSituacao;
  readonly classeEtapa = classeEtapa;
  readonly tooltipEtapa = tooltipEtapa;
  readonly jornadaEncerrada = jornadaEncerrada;

  formatarTelefone(pessoa: Pessoa): string {
    return this.pessoaService.formatarTelefone(pessoa) || 'Sem telefone';
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
