import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface PessoaLiderBase {
  seq_pessoa: number;
  seq_lider: number;
  dt_inicio?: string;
  dt_fim?: string | null;
  ds_observacao?: string | null;
}

export interface PessoaLiderCreate extends PessoaLiderBase {}

export interface PessoaLiderUpdate extends PessoaLiderBase {
  st_ativo?: boolean | null;
}

export interface PessoaLider extends PessoaLiderBase {
  seq_pessoa_lider: number;
  dt_inicio: string;
  dt_fim: string | null;
  ds_observacao: string | null;
  st_ativo: boolean;
  seq_usuario_inclusao: number;
  ds_nome_usuario_inclusao: string | null;
  seq_usuario_alteracao: number | null;
  ds_nome_usuario_alteracao: string | null;
  dh_inclusao: string;
  dh_alteracao: string | null;
}

export interface PessoaLiderFiltros {
  seq_pessoa?: number | null;
  seq_lider?: number | null;
  st_ativo?: boolean | null;
}

export interface PessoaLiderLoteCreate {
  seq_pessoas: number[];
  seq_lider: number;
  dt_inicio: string;
  ds_observacao?: string | null;
}

export interface PessoaLiderLoteResponse {
  seq_lider: number;
  quantidade: number;
  liderancas: PessoaLider[];
}

@Injectable({
  providedIn: 'root',
})
export class PessoaLiderService {
  private readonly apiUrl = `${environment.apiUrl}/pessoas-lideres/`;

  constructor(private readonly http: HttpClient) {}

  listar(filtros: PessoaLiderFiltros = {}): Observable<PessoaLider[]> {
    return this.http.get<PessoaLider[]>(this.apiUrl, {
      params: this.montarParams(filtros),
    });
  }

  buscarPorId(id: number): Observable<PessoaLider> {
    return this.http.get<PessoaLider>(`${this.apiUrl}${id}`);
  }

  criar(lideranca: PessoaLiderCreate): Observable<PessoaLider> {
    return this.http.post<PessoaLider>(this.apiUrl, lideranca);
  }

  definirEmLote(dados: PessoaLiderLoteCreate): Observable<PessoaLiderLoteResponse> {
    return this.http.post<PessoaLiderLoteResponse>(`${this.apiUrl}lote`, dados);
  }

  atualizar(id: number, lideranca: PessoaLiderUpdate): Observable<PessoaLider> {
    return this.http.put<PessoaLider>(`${this.apiUrl}${id}`, lideranca);
  }

  inativar(id: number): Observable<PessoaLider> {
    return this.http.delete<PessoaLider>(`${this.apiUrl}${id}`);
  }

  private montarParams(filtros: PessoaLiderFiltros): HttpParams {
    let params = new HttpParams();

    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor !== null && valor !== undefined) {
        params = params.set(chave, String(valor));
      }
    });

    return params;
  }
}
