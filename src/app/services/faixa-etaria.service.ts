import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface FaixaEtaria {
  seq_faixa_etaria: number;
  ds_nome: string;
  nr_idade_minima: number;
  nr_idade_maxima: number | null;
  st_ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FaixaEtariaService {
  private apiUrl = `${environment.apiUrl}/faixas-etarias/`;

  constructor(private http: HttpClient) {}

  listar(): Observable<FaixaEtaria[]> {
    return this.http.get<FaixaEtaria[]>(this.apiUrl);
  }
}
