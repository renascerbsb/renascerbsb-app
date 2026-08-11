import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { MESES } from '../../core/constants/meses';
import { AuthService } from '../../services/auth.service';
import {
  DashboardAniversariante,
  DashboardFaixaEtaria,
  DashboardJornada,
  DashboardResponse,
  DashboardService,
} from '../../services/dashboard.service';
import { FilialGestao, FilialService } from '../../services/filial.service';
import { JornadaKpis } from '../../services/jornada.service';
import { PessoaService } from '../../services/pessoa.service';

interface ConsultaResultado<T> {
  dados: T | null;
  erro: string;
}

@Component({
  selector: 'app-inicio',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    ChartModule,
    MultiSelectModule,
    TooltipModule,
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);
  private readonly filialService = inject(FilialService);
  private readonly pessoaService = inject(PessoaService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly consultas$ = new Subject<number[]>();
  private readonly chaveFiliaisSessao = 'renascer_dashboard_filiais';

  filiais: FilialGestao[] = [];
  filiaisSelecionadas: number[] = [];
  dashboard: DashboardResponse | null = null;
  indicadoresJornada: DashboardJornada | null = null;
  kpisJornada: JornadaKpis | null = null;
  carregandoFiliais = true;
  carregandoDashboard = false;
  atualizandoDashboard = false;
  erroFiliais = '';
  erroDashboard = '';
  erroJornada = '';
  erroKpisJornada = '';

  readonly opcoesComuns: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { usePointStyle: true } },
    },
  };

  readonly opcoesBarrasHorizontais: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: { x: { beginAtZero: true } },
    plugins: { legend: { labels: { usePointStyle: true } } },
  };

  readonly opcoesFaixaEtaria: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
    plugins: {
      legend: { labels: { usePointStyle: true } },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const faixa = this.dashboard?.distribuicao_faixa_etaria[context.dataIndex];
            return faixa ? this.descreverLimitesFaixa(faixa) : '';
          },
        },
      },
    },
  };

  ngOnInit(): void {
    this.configurarConsultas();
    this.carregarFiliais();
  }

  get filiaisOpcoes(): FilialGestao[] {
    return this.filiais.filter(
      (filial) =>
        filial.st_ativo &&
        filial.st_visualiza &&
        this.authService.podeVisualizarFilial(filial.seq_filial),
    );
  }

  get filialUnica(): FilialGestao | null {
    return this.filiaisOpcoes.length === 1 ? this.filiaisOpcoes[0] : null;
  }

  get filtroLegadoLimitado(): boolean {
    return (
      this.filiaisSelecionadas.length > 1 &&
      this.filiaisSelecionadas.length < this.filiaisOpcoes.length
    );
  }

  get bairroIndisponivel(): boolean {
    return (
      this.dashboard?.limitacoes.some((limitacao) =>
        limitacao.toLocaleLowerCase('pt-BR').includes('bairro'),
      ) ?? false
    );
  }

  get graficoPessoasFilial(): ChartData<'bar'> {
    const dados = this.dashboard?.pessoas_por_filial ?? [];
    return {
      labels: dados.map((item) => item.ds_nome),
      datasets: [
        {
          label: 'Pessoas ativas',
          data: dados.map((item) => item.quantidade),
          backgroundColor: '#b34d0c',
          borderRadius: 6,
        },
      ],
    };
  }

  get graficoGenero(): ChartData<'doughnut'> {
    const dados = this.dashboard?.distribuicao_genero ?? [];
    return {
      labels: dados.map(
        (item) =>
          `${item.categoria}: ${item.quantidade} (${this.formatarPercentual(item.percentual)})`,
      ),
      datasets: [
        {
          data: dados.map((item) => item.quantidade),
          backgroundColor: ['#b34d0c', '#2563eb', '#7c3aed', '#64748b', '#059669'],
          borderWidth: 2,
        },
      ],
    };
  }

  get graficoFaixaEtaria(): ChartData<'bar'> {
    const dados = this.dashboard?.distribuicao_faixa_etaria ?? [];
    return {
      labels: dados.map((item) => item.descricao),
      datasets: [
        {
          label: 'Pessoas ativas',
          data: dados.map((item) => item.quantidade),
          backgroundColor: '#7c3aed',
          borderRadius: 6,
        },
      ],
    };
  }

  get graficoEvolucao(): ChartData<'line'> {
    const dados = this.dashboard?.evolucao_visitantes ?? [];
    return {
      labels: dados.map(
        (item) => `${this.nomeMes(item.mes).slice(0, 3)}/${String(item.ano).slice(-2)}`,
      ),
      datasets: [
        {
          label: 'Visitantes cadastrados',
          data: dados.map((item) => item.total_visitantes),
          borderColor: '#b34d0c',
          backgroundColor: 'rgba(179, 77, 12, .15)',
          tension: 0.25,
        },
        {
          label: 'Visitantes do mês que ingressaram em jornada',
          data: dados.map((item) => item.visitantes_em_jornada),
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, .15)',
          tension: 0.25,
        },
      ],
    };
  }

  get graficoBairro(): ChartData<'bar'> {
    const dados = this.dashboard?.distribuicao_bairro ?? [];
    return {
      labels: dados.map((item) => item.categoria),
      datasets: [
        {
          label: 'Pessoas ativas',
          data: dados.map((item) => item.quantidade),
          backgroundColor: '#059669',
          borderRadius: 6,
        },
      ],
    };
  }

  get gruposAniversarios() {
    return [
      {
        titulo: 'Aniversariantes do mês atual',
        vazio: 'Nenhum aniversariante neste mês.',
        pessoas: this.dashboard?.aniversariantes.mes_atual ?? [],
      },
      {
        titulo: 'Primeiros 15 dias do próximo mês',
        vazio: 'Nenhum aniversariante nos primeiros 15 dias do próximo mês.',
        pessoas: this.dashboard?.aniversariantes.primeiros_15_dias_mes_seguinte ?? [],
      },
    ];
  }

  aoAlterarFiliais(seqFiliais: number[]): void {
    this.filiaisSelecionadas = seqFiliais.length
      ? [...seqFiliais]
      : this.filiaisOpcoes.map((filial) => filial.seq_filial);
    this.salvarSelecao();
    this.consultas$.next([...this.filiaisSelecionadas]);
  }

  selecionarTodasFiliais(): void {
    this.aoAlterarFiliais(this.filiaisOpcoes.map((filial) => filial.seq_filial));
  }

  tentarNovamente(): void {
    this.consultas$.next([...this.filiaisSelecionadas]);
  }

  tentarCarregarFiliais(): void {
    this.carregarFiliais();
  }

  formatarPercentual(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(valor / 100);
  }

  formatarTelefone(telefone: string | null): string {
    return this.pessoaService.formatarTelefone(telefone) || 'Não informado';
  }

  iniciais(nome: string): string {
    return nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join('')
      .toUpperCase();
  }

  nomeMes(mes: number): string {
    return MESES.find((item) => item.valor === mes)?.descricao ?? String(mes);
  }

  dataAniversario(pessoa: DashboardAniversariante): string {
    return `${String(pessoa.dia).padStart(2, '0')} de ${this.nomeMes(pessoa.mes)}`;
  }

  descreverLimitesFaixa(faixa: DashboardFaixaEtaria): string {
    if (faixa.idade_minima !== null && faixa.idade_maxima !== null) {
      return `De ${faixa.idade_minima} a ${faixa.idade_maxima} anos`;
    }
    if (faixa.idade_minima !== null) return `A partir de ${faixa.idade_minima} anos`;
    if (faixa.idade_maxima !== null) return `Até ${faixa.idade_maxima} anos`;
    return 'Limites não informados';
  }

  private configurarConsultas(): void {
    this.consultas$
      .pipe(
        tap(() => {
          this.atualizandoDashboard = this.dashboard !== null;
          this.carregandoDashboard = true;
          this.erroDashboard = '';
          this.erroJornada = '';
          this.erroKpisJornada = '';
        }),
        switchMap((filiais) => {
          const filialLegada = filiais.length === 1 ? filiais[0] : null;
          return forkJoin({
            agregado: this.comErro(
              this.dashboardService.obterDashboard(filiais),
              'Não foi possível carregar os dados gerais do dashboard.',
            ),
            jornada: this.comErro(
              this.dashboardService.obterIndicadoresJornada(filialLegada),
              'Não foi possível carregar os indicadores recentes da Jornada.',
            ),
            kpisJornada: this.comErro(
              this.dashboardService.obterKpisJornada(filialLegada),
              'Não foi possível carregar os indicadores operacionais da Jornada.',
            ),
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ agregado, jornada, kpisJornada }) => {
        this.carregandoDashboard = false;
        this.atualizandoDashboard = false;
        this.erroDashboard = agregado.erro;
        this.erroJornada = jornada.erro;
        this.erroKpisJornada = kpisJornada.erro;
        if (agregado.dados) this.dashboard = agregado.dados;
        if (jornada.dados) this.indicadoresJornada = jornada.dados;
        if (kpisJornada.dados) this.kpisJornada = kpisJornada.dados;
      });
  }

  private carregarFiliais(): void {
    this.carregandoFiliais = true;
    this.erroFiliais = '';
    this.authService
      .atualizarUsuario()
      .pipe(
        catchError(() => of(null)),
        switchMap(() => this.filialService.listarGestao()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (filiais) => {
          this.filiais = filiais;
          this.carregandoFiliais = false;
          const permitidas = this.filiaisOpcoes.map((filial) => filial.seq_filial);
          const armazenadas = this.lerSelecao().filter((seqFilial) =>
            permitidas.includes(seqFilial),
          );
          this.filiaisSelecionadas = armazenadas.length ? armazenadas : permitidas;
          this.salvarSelecao();
          this.consultas$.next([...this.filiaisSelecionadas]);
        },
        error: () => {
          this.carregandoFiliais = false;
          this.erroFiliais = 'Não foi possível carregar as filiais disponíveis.';
        },
      });
  }

  private comErro<T>(fonte: import('rxjs').Observable<T>, mensagem: string) {
    return fonte.pipe(
      map((dados): ConsultaResultado<T> => ({ dados, erro: '' })),
      catchError(() => of<ConsultaResultado<T>>({ dados: null, erro: mensagem })),
    );
  }

  private lerSelecao(): number[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const valor = JSON.parse(sessionStorage.getItem(this.chaveFiliaisSessao) ?? '[]');
      return Array.isArray(valor)
        ? valor.filter((item): item is number => typeof item === 'number')
        : [];
    } catch {
      return [];
    }
  }

  private salvarSelecao(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(this.chaveFiliaisSessao, JSON.stringify(this.filiaisSelecionadas));
    }
  }
}
