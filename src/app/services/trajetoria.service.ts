import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface TrajetoriaBase {
  ds_nome: string;
  ds_descricao?: string | null;
  nr_versao?: number;
}

export interface TrajetoriaCreate extends TrajetoriaBase {}

export interface TrajetoriaUpdate extends TrajetoriaBase {
  st_ativo?: boolean | null;
}

export interface Trajetoria extends TrajetoriaBase {
  seq_trajetoria: number;
  nr_versao: number;
  st_ativo: boolean;
  seq_usuario_inclusao: number;
  seq_usuario_alteracao: number | null;
  ds_nome_usuario_inclusao: string;
  ds_nome_usuario_alteracao: string | null;
  dh_inclusao: string;
  dh_alteracao: string | null;
}

export interface TrajetoriaFiltros {
  st_ativo?: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class TrajetoriaService {
  private readonly apiUrl = `${environment.apiUrl}/trajetorias/`;

  constructor(private readonly http: HttpClient) {}

  listar(filtros: TrajetoriaFiltros = {}): Observable<Trajetoria[]> {
    return this.http.get<Trajetoria[]>(this.apiUrl, {
      params: this.montarParams(filtros)
    });
  }

  buscarPorId(id: number): Observable<Trajetoria> {
    return this.http.get<Trajetoria>(`${this.apiUrl}${id}`);
  }

  criar(trajetoria: TrajetoriaCreate): Observable<Trajetoria> {
    return this.http.post<Trajetoria>(this.apiUrl, trajetoria);
  }

  atualizar(id: number, trajetoria: TrajetoriaUpdate): Observable<Trajetoria> {
    return this.http.put<Trajetoria>(`${this.apiUrl}${id}`, trajetoria);
  }

  inativar(id: number): Observable<Trajetoria> {
    return this.http.delete<Trajetoria>(`${this.apiUrl}${id}`);
  }

  private montarParams(filtros: TrajetoriaFiltros): HttpParams {
    let params = new HttpParams();

    if (filtros.st_ativo !== null && filtros.st_ativo !== undefined) {
      params = params.set('st_ativo', String(filtros.st_ativo));
    }

    return params;
  }
}
