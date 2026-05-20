import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Cidade {
  seq_cidade: number;
  ds_nome: string;
  uf: string;
  st_ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  private apiUrl = `${environment.apiUrl}/cidades/`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(this.apiUrl);
  }
}