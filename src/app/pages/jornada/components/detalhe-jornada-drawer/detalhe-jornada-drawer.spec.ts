import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { PessoaLiderService } from '../../../../services/pessoa-lider.service';
import { PessoaTrajetoriaService } from '../../../../services/pessoa-trajetoria.service';
import { SituacaoTrajetoria } from '../../../../shared/enums/situacao-trajetoria.enum';
import { JornadaLinha } from '../../interfaces/jornada.models';
import { DetalheJornadaDrawer } from './detalhe-jornada-drawer';

describe('DetalheJornadaDrawer', () => {
  let component: DetalheJornadaDrawer;
  let pessoaLiderService: { listar: ReturnType<typeof vi.fn> };
  let pessoaTrajetoriaService: { listarHistorico: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    pessoaLiderService = { listar: vi.fn(() => of([])) };
    pessoaTrajetoriaService = { listarHistorico: vi.fn(() => of([])) };

    await TestBed.configureTestingModule({
      imports: [DetalheJornadaDrawer],
      providers: [
        { provide: PessoaLiderService, useValue: pessoaLiderService },
        { provide: PessoaTrajetoriaService, useValue: pessoaTrajetoriaService },
      ],
    })
      .overrideComponent(DetalheJornadaDrawer, { set: { template: '' } })
      .compileComponents();

    component = TestBed.createComponent(DetalheJornadaDrawer).componentInstance;
  });

  it('carrega histórico e lideranças quando abre com uma linha', () => {
    const linha = criarLinha();
    component.linha = linha;
    component.visivel = true;

    component.ngOnChanges({ visivel: new SimpleChange(false, true, false) });

    expect(component.aba).toBe('resumo');
    expect(pessoaTrajetoriaService.listarHistorico).toHaveBeenCalledWith(30);
    expect(pessoaLiderService.listar).toHaveBeenCalledWith({
      seq_pessoa: 10,
      st_ativo: true,
    });
    expect(pessoaLiderService.listar).toHaveBeenCalledWith({
      seq_pessoa: 10,
      st_ativo: false,
    });
  });

  it('recarrega os detalhes quando a linha aberta é atualizada pelo pai', () => {
    const anterior = criarLinha();
    const atual = criarLinha();
    component.visivel = true;
    component.linha = atual;

    component.ngOnChanges({ linha: new SimpleChange(anterior, atual, false) });

    expect(pessoaTrajetoriaService.listarHistorico).toHaveBeenCalledWith(30);
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
  return {
    pessoaTrajetoria: {
      seq_pessoa_trajetoria: 30,
      seq_pessoa: 10,
      seq_trajetoria: 40,
      nu_situacao: SituacaoTrajetoria.NAO_INICIADA,
      dt_inicio: '2026-07-20',
      dt_conclusao: null,
      ds_observacao: null,
    } as JornadaLinha['pessoaTrajetoria'],
    pessoa: {
      seq_pessoa: 10,
      ds_nome: 'Aldo',
      st_ativo: true,
      seq_filial: 1,
      lider: null,
    } as JornadaLinha['pessoa'],
    trajetoria: {
      seq_trajetoria: 40,
      ds_nome: 'Integração',
      nr_versao: 1,
      st_ativo: true,
    } as JornadaLinha['trajetoria'],
    filial: null,
    etapas: [
      {
        modelo: {
          seq_trajetoria_etapa: 60,
          seq_trajetoria: 40,
          seq_etapa_trajetoria: 1,
          ds_nome: 'Primeiro contato',
          nr_ordem: 1,
          st_obrigatoria: true,
          st_permite_pular: true,
          st_exige_observacao: false,
          st_ativo: true,
        } as JornadaLinha['etapas'][number]['modelo'],
        acompanhamento: {
          seq_pessoa_trajetoria_etapa: 50,
          seq_pessoa_trajetoria: 30,
          seq_trajetoria_etapa: 60,
          nu_situacao: SituacaoTrajetoria.NAO_INICIADA,
          dt_inicio: null,
          dt_conclusao: null,
          ds_observacao: null,
          ds_motivo_pulo: null,
        } as JornadaLinha['etapas'][number]['acompanhamento'],
      },
    ],
  };
}
