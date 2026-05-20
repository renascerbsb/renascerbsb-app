import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Filial {
  seq_filial: number;
  ds_nome: string;
  st_ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FilialService {
  private apiUrl = `${environment.apiUrl}/filiais/`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Filial[]> {
    return this.http.get<Filial[]>(this.apiUrl);
  }
}