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

export interface Filial {
  seq_filial: number;
  ds_nome: string;
  st_ativo: boolean;
}

export interface Vinculo {
  seq_vinculo: number;
  ds_nome: string;
  st_ativo: boolean;
}

export interface Ministerio {
  seq_ministerio: number;
  ds_nome: string;
  st_ativo: boolean;
}

export interface Pessoa {
  seq_pessoa: number;
  ds_nome: string;
  ds_telefone?: string;
  dt_nascimento?: string;
  seq_cidade?: number;
  seq_filial?: number;
  seq_vinculo?: number;
  st_ativo: boolean;

  cidade?: Cidade;
  filial?: Filial;
  vinculo?: Vinculo;
  ministerios?: Ministerio[];
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private apiUrl = `${environment.apiUrl}/pessoas/`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${id}`);
  }

  criar(pessoa: Partial<Pessoa>): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa);
  }

  atualizar(id: number, pessoa: Partial<Pessoa>): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}/${id}`, pessoa);
  }
}