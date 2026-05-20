import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pessoa, PessoaFiltros, PessoaService } from '../../services/pessoa.service'
import { Cidade, CidadeService } from '../../services/cidade.service';
import { Filial, FilialService } from '../../services/filial.service';
import { FaixaEtaria, FaixaEtariaService } from '../../services/faixa-etaria.service';
import { Vinculo, VinculoService } from '../../services/vinculo.service';
import { Ministerio, MinisterioService } from '../../services/ministerio.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pessoas',
  standalone: true,
  templateUrl: './pessoas.html',
  styleUrl: './pessoas.scss',
  imports: [RouterLink, FormsModule],
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

  filtro = {
    seqPessoa: '',
    dsNome: '',
    nrTelefone: '',
    dtNascimento: '',
    seqFaixaEtaria: '',
    seqFilial: '',
    seqCidade: '',
    seqVinculo: '',
    seqLider: '',
    stAtivo: 'true',
    seqMinisterios: [] as string[]
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
          console.error('Erro ao buscar pessoas', erro);
        }
      });
  }

  pesquisar(): void {
    this.carregarPessoas();
  }

  limparFiltros(): void {
    this.filtro = {
      seqPessoa: '',
      dsNome: '',
      nrTelefone: '',
      dtNascimento: '',
      seqFaixaEtaria: '',
      seqFilial: '',
      seqCidade: '',
      seqVinculo: '',
      seqLider: '',
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
        console.error('Erro ao buscar cidades', erro);
      }

    });
  }

  carregarFiliais(): void {
      this.filialService.listar().subscribe({
        next: (dados) => {
          this.filiais = dados;
        },
        error: (erro) => {
          console.error('Erro ao buscar filiais', erro);
        }
      });
  }

  carregarFaixasEtarias(): void {
    this.faixaEtariaService.listar().subscribe({
      next: (dados) => {
        this.faixasEtarias = dados.filter(faixa => faixa.st_ativo);
      },
      error: (erro) => {
        console.error('Erro ao buscar faixas etarias', erro);
      }
    });
  }

  carregarVinculos(): void {
    this.vinculoService.listar().subscribe({
      next: (dados) => {
        this.vinculos = dados.filter(vinculo => vinculo.st_ativo);
      },
      error: (erro) => {
        console.error('Erro ao buscar vinculos', erro);
      }
    });
  }

  carregarMinisterios(): void {
    this.ministerioService.listar().subscribe({
      next: (dados) => {
        this.ministerios = dados.filter(ministerio => ministerio.st_ativo);
      },
      error: (erro) => {
        console.error('Erro ao buscar ministerios', erro);
      }
    });
  }

  carregarLideres(): void {
    this.pessoaService.listar({ st_ativo: true }).subscribe({
      next: (dados) => {
        this.lideres = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar lideres', erro);
      }
    });
  }

  private montarFiltros(): PessoaFiltros {
    return {
      seq_pessoa: this.converterNumero(this.filtro.seqPessoa),
      ds_nome: this.converterTexto(this.filtro.dsNome),
      nr_telefone: this.converterTexto(this.filtro.nrTelefone),
      dt_nascimento: this.converterTexto(this.filtro.dtNascimento),
      seq_cidade: this.converterNumero(this.filtro.seqCidade),
      seq_filial: this.converterNumero(this.filtro.seqFilial),
      seq_vinculo: this.converterNumero(this.filtro.seqVinculo),
      seq_faixa_etaria: this.converterNumero(this.filtro.seqFaixaEtaria),
      seq_lider: this.converterNumero(this.filtro.seqLider),
      st_ativo: this.converterBooleano(this.filtro.stAtivo),
      seq_ministerios: this.filtro.seqMinisterios.map(seqMinisterio => Number(seqMinisterio))
    };
  }

  private converterNumero(valor: string): number | null {
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
}
