import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface EtapaTrajetoriaBase {
  ds_nome: string;
  ds_descricao?: string | null;
  color_tag: string;
  prime_icon: string;
}

export interface EtapaTrajetoriaCreate extends EtapaTrajetoriaBase {}

export interface EtapaTrajetoriaUpdate extends EtapaTrajetoriaBase {
  st_ativo?: boolean | null;
}

export interface EtapaTrajetoria extends EtapaTrajetoriaBase {
  seq_etapa_trajetoria: number;
  st_ativo: boolean;
}

export interface EtapaTrajetoriaFiltros {
  st_ativo?: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class EtapaTrajetoriaService {
  private readonly apiUrl = `${environment.apiUrl}/etapas-trajetoria/`;

  constructor(private readonly http: HttpClient) {}

  listar(filtros: EtapaTrajetoriaFiltros = {}): Observable<EtapaTrajetoria[]> {
    return this.http.get<EtapaTrajetoria[]>(this.apiUrl, {
      params: this.montarParams(filtros)
    });
  }

  buscarPorId(id: number): Observable<EtapaTrajetoria> {
    return this.http.get<EtapaTrajetoria>(`${this.apiUrl}${id}`);
  }

  criar(etapa: EtapaTrajetoriaCreate): Observable<EtapaTrajetoria> {
    return this.http.post<EtapaTrajetoria>(this.apiUrl, etapa);
  }

  atualizar(id: number, etapa: EtapaTrajetoriaUpdate): Observable<EtapaTrajetoria> {
    return this.http.put<EtapaTrajetoria>(`${this.apiUrl}${id}`, etapa);
  }

  inativar(id: number): Observable<EtapaTrajetoria> {
    return this.http.delete<EtapaTrajetoria>(`${this.apiUrl}${id}`);
  }

  private montarParams(filtros: EtapaTrajetoriaFiltros): HttpParams {
    let params = new HttpParams();

    if (filtros.st_ativo !== null && filtros.st_ativo !== undefined) {
      params = params.set('st_ativo', String(filtros.st_ativo));
    }

    return params;
  }
}
