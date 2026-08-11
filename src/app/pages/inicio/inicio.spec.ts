import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject, of } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { DashboardResponse, DashboardService } from '../../services/dashboard.service';
import { FilialService } from '../../services/filial.service';
import { PessoaService } from '../../services/pessoa.service';
import { Inicio } from './inicio';

const RESPOSTA: DashboardResponse = {
  filtros: { filiais_aplicadas: [1, 2] },
  kpis: {
    total_pessoas_ativas: 0,
    visitantes_mes_atual: 0,
    visitantes_mes_atual_em_jornada: 0,
    percentual_visitantes_mes_atual_em_jornada: 0,
    jornadas_em_andamento: 0,
    pessoas_ativas_sem_lideranca: 0,
  },
  pessoas_por_filial: [
    { seq_filial: 1, ds_nome: 'Central', quantidade: 8, percentual: 80 },
    { seq_filial: 2, ds_nome: 'Norte', quantidade: 2, percentual: 20 },
  ],
  aniversariantes: {
    mes_atual: [],
    primeiros_15_dias_mes_seguinte: [],
    sem_data_nascimento: 2,
  },
  distribuicao_genero: [{ categoria: 'Não informado', quantidade: 0, percentual: 0 }],
  distribuicao_faixa_etaria: [
    {
      seq_faixa_etaria: null,
      descricao: 'Não informada',
      idade_minima: null,
      idade_maxima: null,
      quantidade: 0,
      percentual: 0,
      ordem: 99,
    },
  ],
  distribuicao_bairro: [],
  evolucao_visitantes: [{ mes: 8, ano: 2026, total_visitantes: 0, visitantes_em_jornada: 0 }],
  qualidade_cadastral: {
    sem_data_nascimento: 2,
    sem_bairro: null,
    sem_genero: 0,
    sem_telefone: 0,
    sem_lideranca: 0,
  },
  limitacoes: ['O modelo atual não possui bairro.'],
};

describe('Inicio', () => {
  let component: Inicio;
  let fixture: ComponentFixture<Inicio>;
  let dashboardService: {
    obterDashboard: ReturnType<typeof vi.fn>;
    obterIndicadoresJornada: ReturnType<typeof vi.fn>;
    obterKpisJornada: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    sessionStorage.clear();
    dashboardService = {
      obterDashboard: vi.fn(() => of(RESPOSTA)),
      obterIndicadoresJornada: vi.fn(() =>
        of({
          periodo_dias: 30,
          novos_visitantes: 4,
          pessoas_em_jornada: 3,
          jornadas_concluidas: 2,
          pendencias_vencidas: 1,
        }),
      ),
      obterKpisJornada: vi.fn(() =>
        of({
          periodo_dias: 30,
          novos_visitantes: 4,
          sem_lider: 1,
          em_acompanhamento: 3,
          jornadas_concluidas: 2,
          pendencias_vencidas: 1,
        }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [
        provideRouter([]),
        { provide: DashboardService, useValue: dashboardService },
        {
          provide: AuthService,
          useValue: {
            atualizarUsuario: vi.fn(() => of(null)),
            podeVisualizarFilial: vi.fn(() => true),
          },
        },
        {
          provide: FilialService,
          useValue: {
            listarGestao: vi.fn(() =>
              of([
                {
                  seq_filial: 1,
                  ds_nome: 'Central',
                  st_ativo: true,
                  st_visualiza: true,
                  st_edita: true,
                },
                {
                  seq_filial: 2,
                  ds_nome: 'Norte',
                  st_ativo: true,
                  st_visualiza: true,
                  st_edita: false,
                },
              ]),
            ),
          },
        },
        { provide: PessoaService, useValue: { formatarTelefone: vi.fn(() => '') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Inicio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve selecionar todas as filiais permitidas e fazer uma consulta agregada', () => {
    expect(component.filiaisSelecionadas).toEqual([1, 2]);
    expect(dashboardService.obterDashboard).toHaveBeenCalledTimes(1);
    expect(dashboardService.obterDashboard).toHaveBeenCalledWith([1, 2]);
  });

  it('deve preservar os dois conjuntos de indicadores da Jornada', () => {
    expect(dashboardService.obterIndicadoresJornada).toHaveBeenCalledWith(null);
    expect(dashboardService.obterKpisJornada).toHaveBeenCalledWith(null);
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('Pessoas em jornada');
    expect(texto).toContain('Em acompanhamento');
    expect(texto).toContain('Abrir Jornada');
  });

  it('deve exibir zeros e não converter sem_bairro nulo em zero', () => {
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('Visitantes no mês');
    expect(texto).toContain('0%');
    expect(texto).toContain('Bairro: informação indisponível');
    expect(texto).not.toContain('0 pessoas sem bairro');
  });

  it('deve aplicar uma filial aos três contratos e persistir a seleção na sessão', () => {
    component.aoAlterarFiliais([2]);
    fixture.detectChanges();
    expect(dashboardService.obterDashboard).toHaveBeenLastCalledWith([2]);
    expect(dashboardService.obterIndicadoresJornada).toHaveBeenLastCalledWith(2);
    expect(dashboardService.obterKpisJornada).toHaveBeenLastCalledWith(2);
    expect(sessionStorage.getItem('renascer_dashboard_filiais')).toBe('[2]');
  });

  it('deve descartar a resposta obsoleta quando o filtro muda rapidamente', () => {
    const antiga = new Subject<DashboardResponse>();
    const nova = new Subject<DashboardResponse>();
    dashboardService.obterDashboard
      .mockImplementationOnce(() => antiga)
      .mockImplementationOnce(() => nova);
    component.aoAlterarFiliais([1]);
    component.aoAlterarFiliais([2]);
    nova.next({ ...RESPOSTA, kpis: { ...RESPOSTA.kpis, total_pessoas_ativas: 2 } });
    nova.complete();
    antiga.next({ ...RESPOSTA, kpis: { ...RESPOSTA.kpis, total_pessoas_ativas: 1 } });
    antiga.complete();
    expect(component.dashboard?.kpis.total_pessoas_ativas).toBe(2);
  });
});
