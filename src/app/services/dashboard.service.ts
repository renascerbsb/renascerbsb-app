import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface DashboardJornada {
  periodo_dias: number;
  novos_visitantes: number;
  pessoas_em_jornada: number;
  jornadas_concluidas: number;
  pendencias_vencidas: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/dashboard/jornada`;

  constructor(private readonly http: HttpClient) {}

  obterIndicadoresJornada(
    seqFilial?: number | null,
    periodoDias = 30,
  ): Observable<DashboardJornada> {
    let params = new HttpParams().set('periodo_dias', String(periodoDias));
    if (seqFilial) {
      params = params.set('seq_filial', String(seqFilial));
    }
    return this.http.get<DashboardJornada>(this.apiUrl, { params });
  }
}
