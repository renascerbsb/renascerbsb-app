import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { SituacaoTrajetoria } from '../shared/enums/situacao-trajetoria.enum';

export interface PessoaTrajetoriaEtapaBase {
  seq_pessoa_trajetoria: number;
  seq_trajetoria_etapa: number;
  nu_situacao?: SituacaoTrajetoria;
  dt_inicio?: string | null;
  dt_conclusao?: string | null;
  ds_observacao?: string | null;
  ds_motivo_pulo?: string | null;
}

export interface PessoaTrajetoriaEtapaCreate extends PessoaTrajetoriaEtapaBase {}

export interface PessoaTrajetoriaEtapaUpdate extends PessoaTrajetoriaEtapaBase {}

export interface PessoaTrajetoriaEtapa extends PessoaTrajetoriaEtapaBase {
  seq_pessoa_trajetoria_etapa: number;
  nu_situacao: SituacaoTrajetoria;
  dt_inicio: string | null;
  dt_conclusao: string | null;
  ds_observacao: string | null;
  ds_motivo_pulo: string | null;
  seq_usuario_inclusao: number;
  ds_nome_usuario_inclusao: string | null;
  seq_usuario_alteracao: number | null;
  ds_nome_usuario_alteracao: string | null;
  dh_inclusao: string;
  dh_alteracao: string | null;
}

export interface PessoaTrajetoriaEtapaFiltros {
  seq_pessoa_trajetoria?: number | null;
  nu_situacao?: SituacaoTrajetoria | null;
}

@Injectable({
  providedIn: 'root',
})
export class PessoaTrajetoriaEtapaService {
  private readonly apiUrl = `${environment.apiUrl}/pessoas-trajetorias-etapas/`;

  constructor(private readonly http: HttpClient) {}

  listar(filtros: PessoaTrajetoriaEtapaFiltros = {}): Observable<PessoaTrajetoriaEtapa[]> {
    return this.http.get<PessoaTrajetoriaEtapa[]>(this.apiUrl, {
      params: this.montarParams(filtros),
    });
  }

  buscarPorId(id: number): Observable<PessoaTrajetoriaEtapa> {
    return this.http.get<PessoaTrajetoriaEtapa>(`${this.apiUrl}${id}`);
  }

  criar(etapa: PessoaTrajetoriaEtapaCreate): Observable<PessoaTrajetoriaEtapa> {
    return this.http.post<PessoaTrajetoriaEtapa>(this.apiUrl, etapa);
  }

  atualizar(id: number, etapa: PessoaTrajetoriaEtapaUpdate): Observable<PessoaTrajetoriaEtapa> {
    return this.http.put<PessoaTrajetoriaEtapa>(`${this.apiUrl}${id}`, etapa);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  private montarParams(filtros: PessoaTrajetoriaEtapaFiltros): HttpParams {
    let params = new HttpParams();

    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor !== null && valor !== undefined) {
        params = params.set(chave, String(valor));
      }
    });

    return params;
  }
}
