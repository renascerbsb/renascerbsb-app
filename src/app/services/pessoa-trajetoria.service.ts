import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { SituacaoTrajetoria } from '../shared/enums/situacao-trajetoria.enum';
import { PessoaTrajetoriaEtapa } from './pessoa-trajetoria-etapa.service';

export interface PessoaTrajetoriaBase {
  seq_pessoa: number;
  seq_trajetoria: number;
  nu_situacao?: SituacaoTrajetoria;
  dt_inicio?: string;
  dt_conclusao?: string | null;
  ds_observacao?: string | null;
}

export interface PessoaTrajetoriaCreate extends PessoaTrajetoriaBase {}

export interface PessoaTrajetoriaUpdate extends PessoaTrajetoriaBase {}

export interface PessoaTrajetoria extends PessoaTrajetoriaBase {
  seq_pessoa_trajetoria: number;
  nu_situacao: SituacaoTrajetoria;
  dt_inicio: string;
  dt_conclusao: string | null;
  ds_observacao: string | null;
  seq_usuario_inclusao: number;
  ds_nome_usuario_inclusao: string | null;
  seq_usuario_alteracao: number | null;
  ds_nome_usuario_alteracao: string | null;
  dh_inclusao: string;
  dh_alteracao: string | null;
}

export interface PessoaTrajetoriaFiltros {
  seq_pessoa?: number | null;
  seq_trajetoria?: number | null;
  nu_situacao?: SituacaoTrajetoria | null;
}

export interface PessoaElegivelTrajetoria {
  seq_pessoa: number;
  ds_nome: string;
  nr_telefone: string | null;
  tp_genero: string | null;
  dt_nascimento: string | null;
  seq_filial: number;
  seq_vinculo: number | null;
  seq_faixa_etaria: number | null;
  seq_lider: number | null;
}

export interface PessoaTrajetoriaLoteCreate {
  seq_filial: number;
  seq_trajetoria: number;
  seq_pessoas: number[];
  dt_inicio: string;
  ds_observacao?: string | null;
}

export interface PessoaTrajetoriaLoteResponse {
  seq_filial: number;
  seq_trajetoria: number;
  quantidade: number;
  pessoas_trajetorias: PessoaTrajetoria[];
}

export interface PessoaTrajetoriaEvolucaoCreate {
  seq_pessoa_trajetoria_etapa: number;
  nu_situacao: SituacaoTrajetoria;
  dt_evento: string;
  ds_observacao?: string | null;
  ds_motivo_pulo?: string | null;
}

export interface PessoaTrajetoriaEvolucaoResponse {
  pessoa_trajetoria: PessoaTrajetoria;
  etapa_atual: PessoaTrajetoriaEtapa;
  proxima_etapa: PessoaTrajetoriaEtapa | null;
}

@Injectable({
  providedIn: 'root',
})
export class PessoaTrajetoriaService {
  private readonly apiUrl = `${environment.apiUrl}/pessoas-trajetorias/`;

  constructor(private readonly http: HttpClient) {}

  listar(filtros: PessoaTrajetoriaFiltros = {}): Observable<PessoaTrajetoria[]> {
    return this.http.get<PessoaTrajetoria[]>(this.apiUrl, {
      params: this.montarParams(filtros),
    });
  }

  listarElegiveis(
    seqFilial: number,
    seqTrajetoria: number,
  ): Observable<PessoaElegivelTrajetoria[]> {
    const params = new HttpParams()
      .set('seq_filial', String(seqFilial))
      .set('seq_trajetoria', String(seqTrajetoria));

    return this.http.get<PessoaElegivelTrajetoria[]>(`${this.apiUrl}elegiveis`, { params });
  }

  buscarPorId(id: number): Observable<PessoaTrajetoria> {
    return this.http.get<PessoaTrajetoria>(`${this.apiUrl}${id}`);
  }

  criar(trajetoria: PessoaTrajetoriaCreate): Observable<PessoaTrajetoria> {
    return this.http.post<PessoaTrajetoria>(this.apiUrl, trajetoria);
  }

  criarEmLote(dados: PessoaTrajetoriaLoteCreate): Observable<PessoaTrajetoriaLoteResponse> {
    return this.http.post<PessoaTrajetoriaLoteResponse>(`${this.apiUrl}lote`, dados);
  }

  atualizar(id: number, trajetoria: PessoaTrajetoriaUpdate): Observable<PessoaTrajetoria> {
    return this.http.put<PessoaTrajetoria>(`${this.apiUrl}${id}`, trajetoria);
  }

  registrarEvolucao(
    id: number,
    dados: PessoaTrajetoriaEvolucaoCreate,
  ): Observable<PessoaTrajetoriaEvolucaoResponse> {
    return this.http.post<PessoaTrajetoriaEvolucaoResponse>(`${this.apiUrl}${id}/evolucoes`, dados);
  }

  listarHistorico(id: number): Observable<PessoaTrajetoriaEtapa[]> {
    return this.http.get<PessoaTrajetoriaEtapa[]>(`${this.apiUrl}${id}/historico`);
  }

  private montarParams(filtros: PessoaTrajetoriaFiltros): HttpParams {
    let params = new HttpParams();

    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor !== null && valor !== undefined) {
        params = params.set(chave, String(valor));
      }
    });

    return params;
  }
}
