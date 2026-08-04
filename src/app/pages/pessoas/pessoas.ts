import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Pessoa, PessoaFiltros, PessoaService } from '../../services/pessoa.service';
import { Cidade, CidadeService } from '../../services/cidade.service';
import { FilialGestao, FilialService } from '../../services/filial.service';
import { AuthService } from '../../services/auth.service';
import { FaixaEtaria, FaixaEtariaService } from '../../services/faixa-etaria.service';
import { Vinculo, VinculoService } from '../../services/vinculo.service';
import { Ministerio, MinisterioService } from '../../services/ministerio.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TelefoneMaskDirective } from '../../shared/directives/telefone-mask.directive';
import { MensagensApp } from '../../shared/constants/mensagens.constants';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  PessoaElegivelTrajetoria,
  PessoaTrajetoriaService,
} from '../../services/pessoa-trajetoria.service';
import { FilialTrajetoriaService } from '../../services/filial-trajetoria.service';
import { Trajetoria, TrajetoriaService } from '../../services/trajetoria.service';

type FiltroValor = string | number | null;

@Component({
  selector: 'app-pessoas',
  standalone: true,
  templateUrl: './pessoas.html',
  styleUrl: './pessoas.scss',
  imports: [
    RouterLink,
    FormsModule,
    ButtonModule,
    CardModule,
    ChipModule,
    DialogModule,
    InputTextModule,
    MessageModule,
    MultiSelectModule,
    SelectModule,
    TableModule,
    TagModule,
    TextareaModule,
    TooltipModule,
    TelefoneMaskDirective,
  ],
})
export class Pessoas implements OnInit {
  pessoas: Pessoa[] = [];
  cidades: Cidade[] = [];
  filiais: FilialGestao[] = [];
  faixasEtarias: FaixaEtaria[] = [];
  vinculos: Vinculo[] = [];
  ministerios: Ministerio[] = [];
  lideres: Pessoa[] = [];
  pessoasFiltradas: Pessoa[] = [];
  jornadasDisponiveis: Trajetoria[] = [];
  pessoasElegiveis: PessoaElegivelTrajetoria[] = [];
  pessoasSelecionadas: PessoaElegivelTrajetoria[] = [];
  modalJornadaVisivel = false;
  carregandoFiliais = false;
  carregandoJornadas = false;
  carregandoPessoasElegiveis = false;
  processandoJornada = false;
  erroFiliais = '';
  erroJornadas = '';
  erroPessoasElegiveis = '';
  erroSalvarJornada = '';
  erroPessoas = '';
  pesquisaNomeJornada = '';
  pesquisaTelefoneJornada = '';
  jornadaEmLote = this.criarFormularioJornada();
  situacoes = [
    { label: 'Ativos', value: 'true' },
    { label: 'Inativos', value: 'false' },
    { label: 'Todos', value: '' },
  ];
  generos = [
    { label: 'Todos', value: '' },
    { label: 'Mulheres', value: 'F' },
    { label: 'Homens', value: 'M' },
  ];

  filtro = {
    dsNome: '',
    nrTelefone: '',
    tpGenero: '',
    dtNascimento: '',
    seqFaixaEtaria: null as FiltroValor,
    seqFilial: null as FiltroValor,
    seqCidade: null as FiltroValor,
    seqVinculo: null as FiltroValor,
    seqLideres: [] as number[],
    stAtivo: 'true',
    seqMinisterios: [] as number[],
  };

  constructor(
    private pessoaService: PessoaService,
    private authService: AuthService,
    private cidadeService: CidadeService,
    private filialService: FilialService,
    private faixaEtariaService: FaixaEtariaService,
    private vinculoService: VinculoService,
    private ministerioService: MinisterioService,
    private filialTrajetoriaService: FilialTrajetoriaService,
    private trajetoriaService: TrajetoriaService,
    private pessoaTrajetoriaService: PessoaTrajetoriaService,
    private messageService: MessageService,
  ) {}

  get filiaisVisualizaveis(): FilialGestao[] {
    return this.filiais.filter(
      (filial) => filial.st_visualiza && this.authService.podeVisualizarFilial(filial.seq_filial),
    );
  }

  get filiaisEditaveis(): FilialGestao[] {
    return this.filiaisVisualizaveis.filter(
      (filial) =>
        filial.st_ativo && filial.st_edita && this.authService.podeEditarFilial(filial.seq_filial),
    );
  }

  get temFilialEditavel(): boolean {
    return this.filiaisEditaveis.length > 0;
  }

  get semFiliaisVisualizaveis(): boolean {
    return !this.carregandoFiliais && !this.erroFiliais && this.filiaisVisualizaveis.length === 0;
  }

  get pessoasElegiveisFiltradas(): PessoaElegivelTrajetoria[] {
    const nome = this.normalizarTexto(this.pesquisaNomeJornada);
    const telefone = this.pesquisaTelefoneJornada.replace(/\D/g, '');

    return this.pessoasElegiveis.filter((pessoa) => {
      const correspondeNome = !nome || this.normalizarTexto(pessoa.ds_nome).includes(nome);
      const correspondeTelefone =
        !telefone || (pessoa.nr_telefone ?? '').replace(/\D/g, '').includes(telefone);

      return correspondeNome && correspondeTelefone;
    });
  }

  get textoQuantidadeSelecionada(): string {
    const quantidade = this.pessoasSelecionadas.length;

    if (quantidade === 0) {
      return 'Nenhuma pessoa selecionada';
    }

    return `${quantidade} ${quantidade === 1 ? 'pessoa selecionada' : 'pessoas selecionadas'}`;
  }

  get labelConfirmarJornada(): string {
    const quantidade = this.pessoasSelecionadas.length;
    return `Iniciar jornada para ${quantidade} ${quantidade === 1 ? 'pessoa' : 'pessoas'}`;
  }

  get podeConfirmarJornada(): boolean {
    return !!(
      this.jornadaEmLote.seqFilial &&
      this.jornadaEmLote.seqTrajetoria &&
      this.pessoasSelecionadas.length &&
      this.jornadaEmLote.dtInicio &&
      this.authService.podeEditarFilial(this.jornadaEmLote.seqFilial) &&
      this.pessoasSelecionadas.every((pessoa) => this.podeEditarPessoaElegivel(pessoa)) &&
      !this.processandoJornada
    );
  }

  ngOnInit(): void {
    this.authService.atualizarUsuario().subscribe({ error: () => undefined });
    this.carregarPessoas();
    this.carregarCidades();
    this.carregarFiliais();
    this.carregarFaixasEtarias();
    this.carregarVinculos();
    this.carregarMinisterios();
    this.carregarLideres();
  }

  carregarPessoas(): void {
    this.erroPessoas = '';
    this.pessoaService.listar(this.montarFiltros()).subscribe({
      next: (dados) => {
        this.pessoas = dados;
      },
      error: (erro: HttpErrorResponse) => {
        this.pessoas = [];
        this.erroPessoas =
          erro.status === 403
            ? 'Você não possui permissão para visualizar pessoas nesta filial.'
            : MensagensApp.Pessoas_Error_BUSCAR_PESSOAS;
        console.error(MensagensApp.Pessoas_Error_BUSCAR_PESSOAS, erro);
      },
    });
  }

  pesquisar(): void {
    this.carregarPessoas();
  }

  formatarNomeLider(pessoa: Pessoa): string {
    if (pessoa.st_lider_restrito) {
      return 'Líder não disponível para visualização';
    }
    const nome = pessoa.lider?.ds_nome?.trim();

    if (!nome) {
      return '-';
    }

    return nome.split(/\s+/).slice(0, 1).join(' ');
  }

  limparFiltros(): void {
    this.filtro = {
      dsNome: '',
      nrTelefone: '',
      tpGenero: '',
      dtNascimento: '',
      seqFaixaEtaria: null,
      seqFilial: null,
      seqCidade: null,
      seqVinculo: null,
      seqLideres: [],
      stAtivo: 'true',
      seqMinisterios: [],
    };

    this.carregarPessoas();
  }

  carregarCidades(): void {
    this.cidadeService.listar().subscribe({
      next: (dados) => {
        this.cidades = dados.map((cidade) => ({
          ...cidade,
          ds_nome: `${cidade.ds_nome} - ${cidade.uf}`,
        }));
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_CIDADES, erro);
      },
    });
  }

  carregarFiliais(): void {
    this.carregandoFiliais = true;
    this.erroFiliais = '';
    this.filialService.listarGestao().subscribe({
      next: (dados) => {
        this.filiais = dados;
        this.carregandoFiliais = false;
      },
      error: (erro) => {
        this.carregandoFiliais = false;
        this.erroFiliais = 'Não foi possível carregar as filiais.';
        console.error(MensagensApp.Pessoas_Error_BUSCAR_FILIAIS, erro);
      },
    });
  }

  abrirModalJornada(): void {
    if (!this.temFilialEditavel) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ação indisponível',
        detail: 'Você possui permissão apenas para visualizar as filiais disponíveis.',
      });
      return;
    }
    this.limparModalJornada();
    this.modalJornadaVisivel = true;
  }

  aoAlterarFilial(seqFilial: number | null): void {
    this.jornadaEmLote.seqFilial = seqFilial;
    this.jornadaEmLote.seqTrajetoria = null;
    this.jornadasDisponiveis = [];
    this.limparPessoasElegiveis();
    this.carregandoJornadas = false;
    this.erroJornadas = '';

    if (!seqFilial) {
      return;
    }

    if (!this.authService.podeEditarFilial(seqFilial)) {
      this.erroJornadas = 'Você não possui permissão para iniciar jornadas nesta filial.';
      this.jornadaEmLote.seqFilial = null;
      return;
    }

    const filialSolicitada = seqFilial;
    this.carregandoJornadas = true;

    forkJoin({
      relacionamentos: this.filialTrajetoriaService.listar({
        seq_filial: filialSolicitada,
        st_ativo: true,
      }),
      trajetorias: this.trajetoriaService.listar({ st_ativo: true }),
    })
      .pipe(
        finalize(() => {
          if (this.jornadaEmLote.seqFilial === filialSolicitada) {
            this.carregandoJornadas = false;
          }
        }),
      )
      .subscribe({
        next: ({ relacionamentos, trajetorias }) => {
          if (this.jornadaEmLote.seqFilial !== filialSolicitada) {
            return;
          }

          const idsDisponiveis = new Set(
            relacionamentos.map((relacionamento) => relacionamento.seq_trajetoria),
          );
          this.jornadasDisponiveis = trajetorias.filter((trajetoria) =>
            idsDisponiveis.has(trajetoria.seq_trajetoria),
          );
        },
        error: (erro) => {
          if (this.jornadaEmLote.seqFilial === filialSolicitada) {
            this.erroJornadas = 'Não foi possível carregar as jornadas desta filial.';
          }
          console.error('Erro ao buscar jornadas da filial', erro);
        },
      });
  }

  aoAlterarJornada(seqTrajetoria: number | null): void {
    this.jornadaEmLote.seqTrajetoria = seqTrajetoria;
    this.limparPessoasElegiveis();

    const seqFilial = this.jornadaEmLote.seqFilial;
    if (!seqFilial || !seqTrajetoria) {
      return;
    }

    const filialSolicitada = seqFilial;
    const trajetoriaSolicitada = seqTrajetoria;
    this.carregandoPessoasElegiveis = true;

    this.pessoaTrajetoriaService
      .listarElegiveis(filialSolicitada, trajetoriaSolicitada)
      .pipe(
        finalize(() => {
          if (
            this.jornadaEmLote.seqFilial === filialSolicitada &&
            this.jornadaEmLote.seqTrajetoria === trajetoriaSolicitada
          ) {
            this.carregandoPessoasElegiveis = false;
          }
        }),
      )
      .subscribe({
        next: (pessoas) => {
          if (
            this.jornadaEmLote.seqFilial === filialSolicitada &&
            this.jornadaEmLote.seqTrajetoria === trajetoriaSolicitada
          ) {
            this.pessoasElegiveis = pessoas;
          }
        },
        error: (erro) => {
          if (
            this.jornadaEmLote.seqFilial === filialSolicitada &&
            this.jornadaEmLote.seqTrajetoria === trajetoriaSolicitada
          ) {
            this.erroPessoasElegiveis = 'Não foi possível consultar as pessoas elegíveis.';
          }
          console.error('Erro ao buscar pessoas elegíveis', erro);
        },
      });
  }

  confirmarInicioJornada(): void {
    if (!this.podeConfirmarJornada) {
      return;
    }

    if (
      !this.authService.podeEditarFilial(this.jornadaEmLote.seqFilial) ||
      this.pessoasSelecionadas.some((pessoa) => !this.podeEditarPessoaElegivel(pessoa))
    ) {
      this.erroSalvarJornada =
        'Você não possui permissão para realizar esta operação nesta filial.';
      return;
    }

    const quantidade = this.pessoasSelecionadas.length;
    this.processandoJornada = true;
    this.erroSalvarJornada = '';

    this.pessoaTrajetoriaService
      .criarEmLote({
        seq_filial: this.jornadaEmLote.seqFilial!,
        seq_trajetoria: this.jornadaEmLote.seqTrajetoria!,
        seq_pessoas: this.pessoasSelecionadas.map((pessoa) => pessoa.seq_pessoa),
        dt_inicio: this.jornadaEmLote.dtInicio,
        ds_observacao: this.jornadaEmLote.dsObservacao.trim() || null,
      })
      .pipe(finalize(() => (this.processandoJornada = false)))
      .subscribe({
        next: (resultado) => {
          this.modalJornadaVisivel = false;
          this.limparModalJornada();
          this.carregarPessoas();
          this.messageService.add({
            severity: 'success',
            summary: MensagensApp.Geral_Success_TITULO,
            detail: `Jornada iniciada com sucesso para ${resultado.quantidade || quantidade} ${
              (resultado.quantidade || quantidade) === 1 ? 'pessoa' : 'pessoas'
            }.`,
          });
        },
        error: (erro: HttpErrorResponse) => {
          this.erroSalvarJornada = this.obterMensagemErro(erro);
        },
      });
  }

  cancelarModalJornada(): void {
    if (!this.processandoJornada) {
      this.modalJornadaVisivel = false;
    }
  }

  aoFecharModalJornada(): void {
    if (!this.processandoJornada) {
      this.limparModalJornada();
    }
  }

  formatarTelefoneElegivel(pessoa: PessoaElegivelTrajetoria): string {
    return this.pessoaService.formatarTelefone(pessoa.nr_telefone) || '-';
  }

  obterSituacaoPessoa(pessoa: PessoaElegivelTrajetoria): string {
    return (
      this.vinculos.find((vinculo) => vinculo.seq_vinculo === pessoa.seq_vinculo)?.ds_nome ??
      'Sem vínculo'
    );
  }

  obterNomeFilial(seqFilial: number): string {
    return this.filiais.find((filial) => filial.seq_filial === seqFilial)?.ds_nome ?? '-';
  }

  obterNomeLider(seqLider: number | null): string | null {
    if (!seqLider) {
      return null;
    }

    return this.lideres.find((lider) => lider.seq_pessoa === seqLider)?.ds_nome?.trim() || null;
  }

  podeEditarPessoa(pessoa: Pessoa): boolean {
    return this.authService.podeEditarFilial(pessoa.seq_filial ?? pessoa.filial?.seq_filial);
  }

  podeEditarPessoaElegivel(pessoa: PessoaElegivelTrajetoria): boolean {
    return this.authService.podeEditarFilial(pessoa.seq_filial);
  }

  readonly pessoaElegivelSelecionavel = ({ data }: { data: PessoaElegivelTrajetoria }) =>
    this.podeEditarPessoaElegivel(data);

  tooltipSemEdicao(): string {
    return 'Você possui permissão apenas para visualizar esta filial.';
  }

  carregarFaixasEtarias(): void {
    this.faixaEtariaService.listar().subscribe({
      next: (dados) => {
        this.faixasEtarias = dados.filter((faixa) => faixa.st_ativo);
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_FAIXAS_ETARIAS, erro);
      },
    });
  }

  carregarVinculos(): void {
    this.vinculoService.listar().subscribe({
      next: (dados) => {
        this.vinculos = dados.filter((vinculo) => vinculo.st_ativo);
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_VINCULOS, erro);
      },
    });
  }

  carregarMinisterios(): void {
    this.ministerioService.listar().subscribe({
      next: (dados) => {
        this.ministerios = dados.filter((ministerio) => ministerio.st_ativo);
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_MINISTERIOS, erro);
      },
    });
  }

  carregarLideres(): void {
    this.pessoaService.listar({ st_ativo: true }).subscribe({
      next: (dados) => {
        this.lideres = dados;
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_LIDERES, erro);
      },
    });
  }

  private montarFiltros(): PessoaFiltros {
    return {
      ds_nome: this.converterTexto(this.filtro.dsNome),
      nr_telefone: this.converterTexto(this.filtro.nrTelefone),
      tp_genero: this.converterGenero(this.filtro.tpGenero),
      dt_nascimento: this.converterTexto(this.filtro.dtNascimento),
      seq_cidade: this.converterNumero(this.filtro.seqCidade),
      seq_filial: this.converterNumero(this.filtro.seqFilial),
      seq_vinculo: this.converterNumero(this.filtro.seqVinculo),
      seq_faixa_etaria: this.converterNumero(this.filtro.seqFaixaEtaria),
      seq_lideres: this.filtro.seqLideres.map((seqLider) => Number(seqLider)),
      st_ativo: this.converterBooleano(this.filtro.stAtivo),
      seq_ministerios: this.filtro.seqMinisterios.map((seqMinisterio) => Number(seqMinisterio)),
    };
  }

  private converterNumero(valor: FiltroValor): number | null {
    return valor ? Number(valor) : null;
  }

  private converterTexto(valor: string): string | null {
    const texto = valor.trim();
    return texto || null;
  }

  private converterBooleano(valor: string): boolean | null {
    if (valor === 'true') {
      return true;
    }

    if (valor === 'false') {
      return false;
    }

    return null;
  }

  private converterGenero(valor: string): 'F' | 'M' | null {
    return valor === 'F' || valor === 'M' ? valor : null;
  }

  private criarFormularioJornada() {
    return {
      seqFilial: null as number | null,
      seqTrajetoria: null as number | null,
      dtInicio: this.obterDataAtual(),
      dsObservacao: '',
    };
  }

  private limparModalJornada(): void {
    this.jornadaEmLote = this.criarFormularioJornada();
    this.jornadasDisponiveis = [];
    this.limparPessoasElegiveis();
    this.carregandoJornadas = false;
    this.erroJornadas = '';
    this.erroSalvarJornada = '';
  }

  private limparPessoasElegiveis(): void {
    this.pessoasElegiveis = [];
    this.pessoasSelecionadas = [];
    this.pesquisaNomeJornada = '';
    this.pesquisaTelefoneJornada = '';
    this.carregandoPessoasElegiveis = false;
    this.erroPessoasElegiveis = '';
    this.erroSalvarJornada = '';
  }

  private obterDataAtual(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  private normalizarTexto(valor: string): string {
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pt-BR')
      .trim();
  }

  private obterMensagemErro(erro: HttpErrorResponse): string {
    if (erro.status === 403) {
      return 'Você não possui permissão para realizar esta operação nesta filial.';
    }
    const detalhe = erro.error?.detail;
    if (typeof detalhe === 'string' && detalhe.trim()) {
      return detalhe;
    }

    return 'Não foi possível iniciar a jornada. Nenhuma pessoa foi incluída.';
  }
}
