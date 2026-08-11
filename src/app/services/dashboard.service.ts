import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { JornadaKpis } from './jornada.service';

export interface DashboardFiltros {
  filiais_aplicadas: number[];
}

export interface DashboardKpis {
  total_pessoas_ativas: number;
  visitantes_mes_atual: number;
  visitantes_mes_atual_em_jornada: number;
  percentual_visitantes_mes_atual_em_jornada: number;
  jornadas_em_andamento: number;
  pessoas_ativas_sem_lideranca: number;
}

export interface DashboardPessoaFilial {
  seq_filial: number;
  ds_nome: string;
  quantidade: number;
  percentual: number;
}

export interface DashboardAniversariante {
  seq_pessoa: number;
  ds_nome: string;
  dia: number;
  mes: number;
  idade_que_completara: number;
  seq_filial: number;
  ds_nome_filial: string;
  nr_telefone: string | null;
}

export interface DashboardAniversariantes {
  mes_atual: DashboardAniversariante[];
  primeiros_15_dias_mes_seguinte: DashboardAniversariante[];
  sem_data_nascimento: number;
}

export interface DashboardDistribuicao {
  categoria: string;
  quantidade: number;
  percentual: number;
}

export interface DashboardFaixaEtaria {
  seq_faixa_etaria: number | null;
  descricao: string;
  idade_minima: number | null;
  idade_maxima: number | null;
  quantidade: number;
  percentual: number;
  ordem: number;
}

export interface DashboardEvolucaoVisitantes {
  mes: number;
  ano: number;
  total_visitantes: number;
  visitantes_em_jornada: number;
}

export interface DashboardQualidadeCadastral {
  sem_data_nascimento: number;
  sem_bairro: number | null;
  sem_genero: number;
  sem_telefone: number;
  sem_lideranca: number;
}

export interface DashboardResponse {
  filtros: DashboardFiltros;
  kpis: DashboardKpis;
  pessoas_por_filial: DashboardPessoaFilial[];
  aniversariantes: DashboardAniversariantes;
  distribuicao_genero: DashboardDistribuicao[];
  distribuicao_faixa_etaria: DashboardFaixaEtaria[];
  distribuicao_bairro: DashboardDistribuicao[];
  evolucao_visitantes: DashboardEvolucaoVisitantes[];
  qualidade_cadastral: DashboardQualidadeCadastral;
  limitacoes: string[];
}

export interface DashboardJornada {
  periodo_dias: number;
  novos_visitantes: number;
  pessoas_em_jornada: number;
  jornadas_concluidas: number;
  pendencias_vencidas: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;
  private readonly jornadaUrl = `${this.apiUrl}/jornada`;
  private readonly jornadaKpisUrl = `${this.jornadaUrl}/kpis`;

  constructor(private readonly http: HttpClient) {}

  obterDashboard(seqFiliais: readonly number[] = []): Observable<DashboardResponse> {
    let params = new HttpParams();
    seqFiliais.forEach((seqFilial) => {
      params = params.append('seq_filial', String(seqFilial));
    });
    return this.http.get<DashboardResponse>(this.apiUrl, { params });
  }

  obterIndicadoresJornada(
    seqFilial?: number | null,
    periodoDias = 30,
  ): Observable<DashboardJornada> {
    return this.http.get<DashboardJornada>(this.jornadaUrl, {
      params: this.montarParametrosJornada(seqFilial, periodoDias),
    });
  }

  obterKpisJornada(seqFilial?: number | null, periodoDias = 30): Observable<JornadaKpis> {
    return this.http.get<JornadaKpis>(this.jornadaKpisUrl, {
      params: this.montarParametrosJornada(seqFilial, periodoDias),
    });
  }

  private montarParametrosJornada(seqFilial?: number | null, periodoDias = 30): HttpParams {
    let params = new HttpParams().set('periodo_dias', String(periodoDias));
    if (seqFilial) {
      params = params.set('seq_filial', String(seqFilial));
    }
    return params;
  }
}
