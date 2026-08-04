import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { SituacaoTrajetoria } from '../shared/enums/situacao-trajetoria.enum';

export type JornadaOrdenacao =
  | 'pessoa'
  | 'trajetoria'
  | 'situacao'
  | 'lider'
  | 'proxima_acao'
  | 'dt_inicio'
  | 'dh_ultima_evolucao';

export type JornadaDirecaoOrdenacao = 'asc' | 'desc';

export interface JornadaConsultaParams {
  page: number;
  pageSize: number;
  pesquisa?: string;
  seqFilial?: number;
  seqTrajetoria?: number;
  nuSituacao?: SituacaoTrajetoria;
  semLider?: boolean;
  sort?: JornadaOrdenacao;
  order?: JornadaDirecaoOrdenacao;
}

export interface JornadaFilial {
  seq_filial: number;
  ds_nome: string;
}

export interface JornadaPessoa {
  seq_pessoa: number;
  ds_nome: string;
  nr_telefone: string | null;
  st_ativo: boolean;
  filial: JornadaFilial | null;
}

export interface JornadaDados {
  seq_pessoa_trajetoria: number;
  seq_trajetoria: number;
  ds_nome: string;
  nu_situacao: SituacaoTrajetoria;
  ds_situacao: string;
  dt_inicio: string;
  dt_conclusao: string | null;
  ds_observacao: string | null;
  st_pausada: boolean;
  st_cancelada: boolean;
  st_concluida: boolean;
}

export interface JornadaLideranca {
  seq_lider: number | null;
  ds_nome: string | null;
  sem_lider: boolean;
  st_lider_restrito: boolean;
}

export interface JornadaEtapa {
  seq_pessoa_trajetoria_etapa: number;
  seq_trajetoria_etapa: number;
  seq_etapa_trajetoria: number;
  ds_nome: string;
  nr_ordem: number;
  nu_situacao: SituacaoTrajetoria;
  ds_situacao: string;
  dt_inicio: string | null;
  dt_conclusao: string | null;
  ds_observacao: string | null;
  ds_motivo_pulo: string | null;
  nr_prazo_dias: number | null;
  st_ativo_configuracao: boolean;
  st_atual: boolean;
  st_concluida: boolean;
  st_futura: boolean;
  st_pulada: boolean;
  st_cancelada: boolean;
  st_vencida: boolean;
}

export interface JornadaProgresso {
  total_etapas: number;
  etapas_concluidas: number;
  etapas_puladas: number;
  etapas_canceladas: number;
  percentual: number;
  etapas: JornadaEtapa[];
}

export interface JornadaItem {
  pessoa: JornadaPessoa;
  jornada: JornadaDados;
  lideranca: JornadaLideranca;
  etapa_atual: JornadaEtapa | null;
  proxima_acao: JornadaEtapa | null;
  progresso: JornadaProgresso;
  dh_ultima_evolucao: string | null;
}

export interface JornadaPaginada {
  items: JornadaItem[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface JornadaKpis {
  periodo_dias: number;
  novos_visitantes: number;
  sem_lider: number;
  em_acompanhamento: number;
  jornadas_concluidas: number;
  pendencias_vencidas: number;
}

@Injectable({ providedIn: 'root' })
export class JornadaService {
  private readonly jornadasUrl = `${environment.apiUrl}/jornadas/`;
  private readonly kpisUrl = `${environment.apiUrl}/dashboard/jornada/kpis`;

  constructor(private readonly http: HttpClient) {}

  listar(parametros: JornadaConsultaParams): Observable<JornadaPaginada> {
    return this.http.get<JornadaPaginada>(this.jornadasUrl, {
      params: this.montarParametros(parametros),
    });
  }

  obterKpis(seqFilial?: number | null, periodoDias = 30): Observable<JornadaKpis> {
    let params = new HttpParams().set('periodo_dias', String(periodoDias));
    if (seqFilial) {
      params = params.set('seq_filial', String(seqFilial));
    }
    return this.http.get<JornadaKpis>(this.kpisUrl, { params });
  }

  private montarParametros(parametros: JornadaConsultaParams): HttpParams {
    let params = new HttpParams()
      .set('page', String(parametros.page))
      .set('page_size', String(parametros.pageSize));

    const opcionais: Record<string, string | number | boolean | undefined> = {
      pesquisa: parametros.pesquisa?.trim() || undefined,
      seq_filial: parametros.seqFilial,
      seq_trajetoria: parametros.seqTrajetoria,
      nu_situacao: parametros.nuSituacao,
      sem_lider: parametros.semLider,
      sort: parametros.sort,
      order: parametros.order,
    };

    Object.entries(opcionais).forEach(([nome, valor]) => {
      if (valor !== undefined) {
        params = params.set(nome, String(valor));
      }
    });

    return params;
  }
}
