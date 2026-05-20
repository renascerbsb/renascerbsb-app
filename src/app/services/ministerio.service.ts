import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Ministerio {
  seq_ministerio: number;
  ds_nome: string;
  st_ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MinisterioService {
  private apiUrl = `${environment.apiUrl}/ministerios/`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Ministerio[]> {
    return this.http.get<Ministerio[]>(this.apiUrl);
  }
}