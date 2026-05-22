import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EventoBase {
  ds_nome: string;
  ds_descricao?: string | null;
  st_evento_fixo: boolean;
  ds_recorrencia?: string | null;
}

export interface EventoCreate extends EventoBase {}

export interface EventoUpdate extends EventoBase {
  st_ativo?: boolean | null;
}

export interface Evento extends EventoBase {
  seq_evento: number;
  st_ativo: boolean;
  dh_inclusao?: string;
}

export interface EventoFiltros {
  seq_evento?: number | null;
  ds_nome?: string | null;
  st_evento_fixo?: boolean | null;
  ds_recorrencia?: string | null;
  st_ativo?: boolean | null;
}

type EventoCreateRequest = EventoCreate & {
  id_usuario_logado: number;
};

type EventoUpdateRequest = EventoUpdate & {
  id_usuario_logado: number;
};

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = `${environment.apiUrl}/eventos/`;

  constructor(private http: HttpClient) {}

  listar(filtros: EventoFiltros = {}): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl, {
      params: this.montarParams(filtros)
    });
  }

  buscarPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}${id}`);
  }

  criar(evento: EventoCreate): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, this.comUsuarioLogado(evento));
  }

  atualizar(id: number, evento: EventoUpdate): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}${id}`, this.comUsuarioLogado(evento));
  }

  private comUsuarioLogado(evento: EventoCreate): EventoCreateRequest;
  private comUsuarioLogado(evento: EventoUpdate): EventoUpdateRequest;
  private comUsuarioLogado(evento: EventoCreate | EventoUpdate): EventoCreateRequest | EventoUpdateRequest {
    return {
      ...evento,
      id_usuario_logado: environment.id_usuario_logado
    };
  }

  private montarParams(filtros: EventoFiltros): HttpParams {
    let params = new HttpParams();

    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor === null || valor === undefined || valor === '') {
        return;
      }

      params = params.set(chave, String(valor));
    });

    return params;
  }
}
