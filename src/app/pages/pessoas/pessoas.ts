import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pessoa, PessoaFiltros, PessoaService } from '../../services/pessoa.service'
import { Cidade, CidadeService } from '../../services/cidade.service';
import { Filial, FilialService } from '../../services/filial.service';
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
import { TelefoneMaskDirective } from '../../shared/directives/telefone-mask.directive';
import { MensagensApp } from '../../shared/constants/mensagens.constants';

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
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    TableModule,
    TagModule,
    TelefoneMaskDirective
  ],
})
export class Pessoas implements OnInit {

  pessoas: Pessoa[] = [];
  cidades: Cidade[] = [];
  filiais: Filial[] = [];
  faixasEtarias: FaixaEtaria[] = [];
  vinculos: Vinculo[] = [];
  ministerios: Ministerio[] = [];
  lideres: Pessoa[] = [];
  pessoasFiltradas: Pessoa[] = [];
  situacoes = [
    { label: 'Ativos', value: 'true' },
    { label: 'Inativos', value: 'false' },
    { label: 'Todos', value: '' }
  ];
  generos = [
    { label: 'Todos', value: '' },
    { label: 'Mulheres', value: 'F' },
    { label: 'Homens', value: 'M' }
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
    seqMinisterios: [] as number[]
  };

  constructor(
    private pessoaService: PessoaService,
    private cidadeService: CidadeService,
    private filialService: FilialService,
    private faixaEtariaService: FaixaEtariaService,
    private vinculoService: VinculoService,
    private ministerioService: MinisterioService
  ) {}

  ngOnInit(): void {

    this.carregarPessoas();
    this.carregarCidades();
    this.carregarFiliais();
    this.carregarFaixasEtarias();
    this.carregarVinculos();
    this.carregarMinisterios();
    this.carregarLideres();
  }

  carregarPessoas(): void {
      this.pessoaService.listar(this.montarFiltros()).subscribe({
        next: (dados) => {
          this.pessoas = dados;
        },
        error: (erro) => {
          console.error(MensagensApp.Pessoas_Error_BUSCAR_PESSOAS, erro);
        }
      });
  }

  pesquisar(): void {
    this.carregarPessoas();
  }

  formatarNomeLider(pessoa: Pessoa): string {
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
      seqMinisterios: []
    };

    this.carregarPessoas();
  }

  carregarCidades(): void {
    this.cidadeService.listar().subscribe({
      next: (dados) => {
        this.cidades = dados.map(cidade => ({
          ...cidade,
          ds_nome: `${cidade.ds_nome} - ${cidade.uf}`
        }));
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_CIDADES, erro);
      }

    });
  }

  carregarFiliais(): void {
      this.filialService.listar().subscribe({
        next: (dados) => {
          this.filiais = dados;
        },
        error: (erro) => {
          console.error(MensagensApp.Pessoas_Error_BUSCAR_FILIAIS, erro);
        }
      });
  }

  carregarFaixasEtarias(): void {
    this.faixaEtariaService.listar().subscribe({
      next: (dados) => {
        this.faixasEtarias = dados.filter(faixa => faixa.st_ativo);
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_FAIXAS_ETARIAS, erro);
      }
    });
  }

  carregarVinculos(): void {
    this.vinculoService.listar().subscribe({
      next: (dados) => {
        this.vinculos = dados.filter(vinculo => vinculo.st_ativo);
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_VINCULOS, erro);
      }
    });
  }

  carregarMinisterios(): void {
    this.ministerioService.listar().subscribe({
      next: (dados) => {
        this.ministerios = dados.filter(ministerio => ministerio.st_ativo);
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_MINISTERIOS, erro);
      }
    });
  }

  carregarLideres(): void {
    this.pessoaService.listar({ st_ativo: true }).subscribe({
      next: (dados) => {
        this.lideres = dados;
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_LIDERES, erro);
      }
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
      seq_lideres: this.filtro.seqLideres.map(seqLider => Number(seqLider)),
      st_ativo: this.converterBooleano(this.filtro.stAtivo),
      seq_ministerios: this.filtro.seqMinisterios.map(seqMinisterio => Number(seqMinisterio))
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
}
