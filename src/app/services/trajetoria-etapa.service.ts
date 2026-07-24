import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface TrajetoriaEtapaBase {
  seq_trajetoria: number;
  seq_etapa_trajetoria: number;
  ds_nome: string;
  ds_descricao?: string | null;
  nr_ordem: number;
  nr_prazo_dias?: number | null;
  st_obrigatoria?: boolean;
  st_permite_pular?: boolean;
  st_exige_observacao?: boolean;
}

export interface TrajetoriaEtapaCreate extends TrajetoriaEtapaBase {}

export interface TrajetoriaEtapaUpdate extends TrajetoriaEtapaBase {
  st_ativo?: boolean | null;
}

export interface TrajetoriaEtapa extends TrajetoriaEtapaBase {
  seq_trajetoria_etapa: number;
  st_obrigatoria: boolean;
  st_permite_pular: boolean;
  st_exige_observacao: boolean;
  st_ativo: boolean;
  seq_usuario_inclusao: number;
  seq_usuario_alteracao: number | null;
  dh_inclusao: string;
  dh_alteracao: string | null;
}

export interface TrajetoriaEtapaFiltros {
  seq_trajetoria?: number | null;
  st_ativo?: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class TrajetoriaEtapaService {
  private readonly apiUrl = `${environment.apiUrl}/trajetorias-etapas/`;

  constructor(private readonly http: HttpClient) {}

  listar(filtros: TrajetoriaEtapaFiltros = {}): Observable<TrajetoriaEtapa[]> {
    return this.http.get<TrajetoriaEtapa[]>(this.apiUrl, {
      params: this.montarParams(filtros)
    });
  }

  buscarPorId(id: number): Observable<TrajetoriaEtapa> {
    return this.http.get<TrajetoriaEtapa>(`${this.apiUrl}${id}`);
  }

  criar(etapa: TrajetoriaEtapaCreate): Observable<TrajetoriaEtapa> {
    return this.http.post<TrajetoriaEtapa>(this.apiUrl, etapa);
  }

  atualizar(id: number, etapa: TrajetoriaEtapaUpdate): Observable<TrajetoriaEtapa> {
    return this.http.put<TrajetoriaEtapa>(`${this.apiUrl}${id}`, etapa);
  }

  inativar(id: number): Observable<TrajetoriaEtapa> {
    return this.http.delete<TrajetoriaEtapa>(`${this.apiUrl}${id}`);
  }

  private montarParams(filtros: TrajetoriaEtapaFiltros): HttpParams {
    let params = new HttpParams();

    if (filtros.seq_trajetoria !== null && filtros.seq_trajetoria !== undefined) {
      params = params.set('seq_trajetoria', String(filtros.seq_trajetoria));
    }

    if (filtros.st_ativo !== null && filtros.st_ativo !== undefined) {
      params = params.set('st_ativo', String(filtros.st_ativo));
    }

    return params;
  }
}
