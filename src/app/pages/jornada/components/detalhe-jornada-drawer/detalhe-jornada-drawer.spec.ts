import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { PessoaTrajetoriaService } from '../../../../services/pessoa-trajetoria.service';
import { SituacaoTrajetoria } from '../../../../shared/enums/situacao-trajetoria.enum';
import { JornadaLinha } from '../../interfaces/jornada.models';
import { DetalheJornadaDrawer } from './detalhe-jornada-drawer';

describe('DetalheJornadaDrawer', () => {
  let component: DetalheJornadaDrawer;
  let pessoaTrajetoriaService: { listarHistorico: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    pessoaTrajetoriaService = { listarHistorico: vi.fn(() => of([])) };

    await TestBed.configureTestingModule({
      imports: [DetalheJornadaDrawer],
      providers: [{ provide: PessoaTrajetoriaService, useValue: pessoaTrajetoriaService }],
    })
      .overrideComponent(DetalheJornadaDrawer, { set: { template: '' } })
      .compileComponents();

    component = TestBed.createComponent(DetalheJornadaDrawer).componentInstance;
  });

  it('carrega somente o histórico ao abrir com uma linha agregada', () => {
    component.linha = criarLinha();
    component.visivel = true;

    component.ngOnChanges({ visivel: new SimpleChange(false, true, false) });

    expect(component.aba).toBe('resumo');
    expect(pessoaTrajetoriaService.listarHistorico).toHaveBeenCalledOnce();
    expect(pessoaTrajetoriaService.listarHistorico).toHaveBeenCalledWith(30);
  });

  it('atualiza o histórico quando o pai recarrega a linha aberta', () => {
    const anterior = criarLinha();
    const atual = criarLinha();
    component.visivel = true;
    component.linha = atual;

    component.ngOnChanges({ linha: new SimpleChange(anterior, atual, false) });

    expect(pessoaTrajetoriaService.listarHistorico).toHaveBeenCalledWith(30);
  });

  it('obtém o nome da etapa do progresso agregado', () => {
    component.linha = criarLinha();
    expect(component.nomeEtapa(60)).toBe('Primeiro contato');
    expect(component.nomeEtapa(999)).toBe('Etapa');
  });

  it('emite fechamento e solicitação de evolução sem alterar a linha', () => {
    const linha = criarLinha();
    const fechar = vi.fn();
    const evolucao = vi.fn();
    component.linha = linha;
    component.fechar.subscribe(fechar);
    component.solicitarEvolucao.subscribe(evolucao);

    component.solicitarFechamento();
    component.abrirEvolucao();

    expect(fechar).toHaveBeenCalledOnce();
    expect(evolucao).toHaveBeenCalledWith(linha);
  });
});

function criarLinha(): JornadaLinha {
  const etapa = {
    seq_pessoa_trajetoria_etapa: 50,
    seq_trajetoria_etapa: 60,
    seq_etapa_trajetoria: 1,
    ds_nome: 'Primeiro contato',
    nr_ordem: 1,
    nu_situacao: SituacaoTrajetoria.EM_ANDAMENTO,
    ds_situacao: 'EM_ANDAMENTO',
    dt_inicio: '2026-07-20',
    dt_conclusao: null,
    ds_observacao: null,
    ds_motivo_pulo: null,
    nr_prazo_dias: 3,
    st_ativo_configuracao: true,
    st_atual: true,
    st_concluida: false,
    st_futura: false,
    st_pulada: false,
    st_cancelada: false,
    st_vencida: false,
  };
  return {
    pessoa: { seq_pessoa: 10, ds_nome: 'Aldo', nr_telefone: null, st_ativo: true, filial: null },
    jornada: {
      seq_pessoa_trajetoria: 30,
      seq_trajetoria: 40,
      ds_nome: 'Integração',
      nu_situacao: SituacaoTrajetoria.EM_ANDAMENTO,
      ds_situacao: 'EM_ANDAMENTO',
      dt_inicio: '2026-07-20',
      dt_conclusao: null,
      ds_observacao: null,
      st_pausada: false,
      st_cancelada: false,
      st_concluida: false,
    },
    lideranca: { seq_lider: null, ds_nome: null, sem_lider: true },
    etapa_atual: etapa,
    proxima_acao: etapa,
    progresso: {
      total_etapas: 1,
      etapas_concluidas: 0,
      etapas_puladas: 0,
      etapas_canceladas: 0,
      percentual: 0,
      etapas: [etapa],
    },
    dh_ultima_evolucao: null,
  };
}
