import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cidade } from './cidade.service';
import { Filial } from './filial.service';
import { Vinculo } from './vinculo.service';
import { Ministerio } from './ministerio.service';
import { FaixaEtaria } from './faixa-etaria.service';

export interface PessoaBase {
  ds_nome: string;
  nr_telefone?: string | null;
  dt_nascimento?: string | null;
  seq_cidade?: number | null;
  seq_filial?: number | null;
  seq_vinculo?: number | null;
  seq_faixa_etaria?: number | null;
  seq_lider?: number | null;
}

export interface PessoaCreate extends PessoaBase {
  seq_ministerios: number[];
}

export interface PessoaUpdate extends PessoaBase {
  st_ativo?: boolean | null;
  seq_ministerios: number[];
}

export interface PessoaLider {
  seq_pessoa: number;
  ds_nome: string;
  nr_telefone?: string | null;
}

export interface Pessoa extends PessoaBase {
  seq_pessoa: number;
  st_ativo: boolean;
  dh_inclusao: string;
  cidade?: Cidade;
  filial?: Filial;
  vinculo?: Vinculo;
  faixa_etaria?: FaixaEtaria | null;
  lider?: PessoaLider | null;
  ministerios?: Ministerio[];
}

export interface PessoaFiltros {
  seq_pessoa?: number | null;
  ds_nome?: string | null;
  nr_telefone?: string | null;
  dt_nascimento?: string | null;
  seq_cidade?: number | null;
  seq_filial?: number | null;
  seq_vinculo?: number | null;
  seq_faixa_etaria?: number | null;
  seq_lider?: number | null;
  st_ativo?: boolean | null;
  seq_ministerios?: number[];
}

type PessoaCreateRequest = PessoaCreate & {
  id_usuario_logado: number;
};

type PessoaUpdateRequest = PessoaUpdate & {
  id_usuario_logado: number;
};

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private apiUrl = `${environment.apiUrl}/pessoas/`;

  constructor(private http: HttpClient) {}

  listar(filtros: PessoaFiltros = {}): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.apiUrl, {
      params: this.montarParams(filtros)
    });
  }

  buscarPorId(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${id}`);
  }

  criar(pessoa: PessoaCreate): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, this.comUsuarioLogado(pessoa));
  }

  atualizar(id: number, pessoa: PessoaUpdate): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}/${id}`, this.comUsuarioLogado(pessoa));
  }

  calcularIdade(pessoaOuData: Pessoa | string | null | undefined): number | null {
    const dataNascimento = typeof pessoaOuData === 'string'
      ? pessoaOuData
      : pessoaOuData?.dt_nascimento;

    if (!dataNascimento) {
      return null;
    }

    const nascimento = this.criarDataLocal(dataNascimento);

    if (!nascimento) {
      return null;
    }

    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const aniversarioJaPassou =
      hoje.getMonth() > nascimento.getMonth() ||
      (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() >= nascimento.getDate());

    if (!aniversarioJaPassou) {
      idade--;
    }

    return idade;
  }

  formatarTelefone(pessoaOuTelefone: Pessoa | PessoaLider | string | null | undefined): string {
    const telefone = typeof pessoaOuTelefone === 'string'
      ? pessoaOuTelefone
      : pessoaOuTelefone?.nr_telefone;

    if (!telefone) {
      return '';
    }

    const numeros = telefone.replace(/\D/g, '');

    if (numeros.length === 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }

    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }

    return telefone;
  }

  private comUsuarioLogado(pessoa: PessoaCreate): PessoaCreateRequest;
  private comUsuarioLogado(pessoa: PessoaUpdate): PessoaUpdateRequest;
  private comUsuarioLogado(pessoa: PessoaCreate | PessoaUpdate): PessoaCreateRequest | PessoaUpdateRequest {
    return {
      ...pessoa,
      id_usuario_logado: environment.id_usuario_logado
    };
  }

  private montarParams(filtros: PessoaFiltros): HttpParams {
    let params = new HttpParams();

    Object.entries(filtros).forEach(([chave, valor]) => {
      if (chave === 'seq_ministerios' || valor === null || valor === undefined || valor === '') {
        return;
      }

      params = params.set(chave, String(valor));
    });

    filtros.seq_ministerios?.forEach(seqMinisterio => {
      params = params.append('seq_ministerios', String(seqMinisterio));
    });

    return params;
  }

  private criarDataLocal(data: string): Date | null {
    const partes = data.split('-').map(Number);

    if (partes.length < 3 || partes.some(Number.isNaN)) {
      return null;
    }

    const [ano, mes, dia] = partes;
    const dataLocal = new Date(ano, mes - 1, dia);

    if (
      dataLocal.getFullYear() !== ano ||
      dataLocal.getMonth() !== mes - 1 ||
      dataLocal.getDate() !== dia
    ) {
      return null;
    }

    return dataLocal;
  }
}
