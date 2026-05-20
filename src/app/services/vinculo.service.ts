import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Vinculo {
  seq_vinculo: number;
  ds_nome: string;
  st_ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VinculoService {
  private apiUrl = `${environment.apiUrl}/vinculos/`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Vinculo[]> {
    return this.http.get<Vinculo[]>(this.apiUrl);
  }
}