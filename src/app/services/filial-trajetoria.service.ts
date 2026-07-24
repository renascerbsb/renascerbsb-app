import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface FilialTrajetoriaCreate {
  seq_filial: number;
  seq_trajetoria: number;
  st_padrao?: boolean;
}

export interface FilialTrajetoriaUpdate {
  st_padrao: boolean;
  st_ativo?: boolean | null;
}

export interface FilialTrajetoria {
  seq_filial: number;
  seq_trajetoria: number;
  st_padrao: boolean;
  st_ativo: boolean;
  seq_usuario_inclusao: number;
  seq_usuario_alteracao: number | null;
  dh_inclusao: string;
  dh_alteracao: string | null;
}

export interface FilialTrajetoriaFiltros {
  seq_filial?: number | null;
  seq_trajetoria?: number | null;
  st_padrao?: boolean | null;
  st_ativo?: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class FilialTrajetoriaService {
  private readonly apiUrl = `${environment.apiUrl}/filiais-trajetorias/`;

  constructor(private readonly http: HttpClient) {}

  listar(filtros: FilialTrajetoriaFiltros = {}): Observable<FilialTrajetoria[]> {
    return this.http.get<FilialTrajetoria[]>(this.apiUrl, {
      params: this.montarParams(filtros)
    });
  }

  buscarPorId(seqFilial: number, seqTrajetoria: number): Observable<FilialTrajetoria> {
    return this.http.get<FilialTrajetoria>(`${this.apiUrl}${seqFilial}/${seqTrajetoria}`);
  }

  criar(relacionamento: FilialTrajetoriaCreate): Observable<FilialTrajetoria> {
    return this.http.post<FilialTrajetoria>(this.apiUrl, relacionamento);
  }

  atualizar(
    seqFilial: number,
    seqTrajetoria: number,
    relacionamento: FilialTrajetoriaUpdate
  ): Observable<FilialTrajetoria> {
    return this.http.put<FilialTrajetoria>(
      `${this.apiUrl}${seqFilial}/${seqTrajetoria}`,
      relacionamento
    );
  }

  inativar(seqFilial: number, seqTrajetoria: number): Observable<FilialTrajetoria> {
    return this.http.delete<FilialTrajetoria>(`${this.apiUrl}${seqFilial}/${seqTrajetoria}`);
  }

  private montarParams(filtros: FilialTrajetoriaFiltros): HttpParams {
    let params = new HttpParams();

    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor !== null && valor !== undefined) {
        params = params.set(chave, String(valor));
      }
    });

    return params;
  }
}
