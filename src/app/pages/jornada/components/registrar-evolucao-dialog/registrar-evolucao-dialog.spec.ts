import { HttpErrorResponse } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { PessoaTrajetoriaEtapaService } from '../../../../services/pessoa-trajetoria-etapa.service';
import { PessoaTrajetoriaService } from '../../../../services/pessoa-trajetoria.service';
import { SituacaoTrajetoria } from '../../../../shared/enums/situacao-trajetoria.enum';
import { JornadaLinha } from '../../interfaces/jornada.models';
import { RegistrarEvolucaoDialog } from './registrar-evolucao-dialog';

describe('RegistrarEvolucaoDialog', () => {
  let component: RegistrarEvolucaoDialog;
  let pessoaTrajetoriaService: {
    registrarEvolucao: ReturnType<typeof vi.fn>;
    atualizar: ReturnType<typeof vi.fn>;
  };
  let pessoaTrajetoriaEtapaService: { atualizar: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    pessoaTrajetoriaService = {
      registrarEvolucao: vi.fn(() =>
        of({ pessoa_trajetoria: {}, etapa_atual: {}, proxima_etapa: null }),
      ),
      atualizar: vi.fn(() => of({})),
    };
    pessoaTrajetoriaEtapaService = { atualizar: vi.fn(() => of({})) };

    await TestBed.configureTestingModule({
      imports: [RegistrarEvolucaoDialog],
      providers: [
        { provide: PessoaTrajetoriaService, useValue: pessoaTrajetoriaService },
        { provide: PessoaTrajetoriaEtapaService, useValue: pessoaTrajetoriaEtapaService },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    })
      .overrideComponent(RegistrarEvolucaoDialog, { set: { template: '' } })
      .compileComponents();

    component = TestBed.createComponent(RegistrarEvolucaoDialog).componentInstance;
  });

  it('carrega cópias dos dados atuais ao abrir, sem alterar a linha recebida', () => {
    const linha = criarLinha();
    abrirModal(linha);

    expect(component.situacaoEtapaEvolucao).toBe(SituacaoTrajetoria.NAO_INICIADA);
    expect(component.observacaoEvolucao).toBe('Observação atual');

    component.observacaoEvolucao = 'Cópia editada';

    expect(linha.etapas[0].acompanhamento?.ds_observacao).toBe('Observação atual');
  });

  it('emite o fechamento somente quando não está salvando', () => {
    const fechar = vi.fn();
    component.fechar.subscribe(fechar);

    component.solicitarFechamento();
    component.salvandoEvolucao = true;
    component.solicitarFechamento();

    expect(fechar).toHaveBeenCalledOnce();
  });

  it('mantém o payload da evolução por mudança de situação e emite sucesso', () => {
    const linha = criarLinha();
    const salvo = vi.fn();
    component.salvo.subscribe(salvo);
    abrirModal(linha);
    component.situacaoEtapaEvolucao = SituacaoTrajetoria.CONCLUIDA;
    component.dataConclusaoEtapaEvolucao = '2026-07-24';
    component.observacaoEvolucao = 'Etapa concluída';

    component.registrarEvolucao();

    expect(pessoaTrajetoriaService.registrarEvolucao).toHaveBeenCalledWith(30, {
      seq_pessoa_trajetoria_etapa: 50,
      nu_situacao: SituacaoTrajetoria.CONCLUIDA,
      dt_evento: '2026-07-24',
      ds_observacao: 'Etapa concluída',
      ds_motivo_pulo: null,
    });
    expect(pessoaTrajetoriaEtapaService.atualizar).not.toHaveBeenCalled();
    expect(salvo).toHaveBeenCalledOnce();
  });

  it('mantém o PUT da etapa quando somente os demais campos são alterados', () => {
    const linha = criarLinha();
    abrirModal(linha);
    component.observacaoEvolucao = 'Observação revisada';

    component.registrarEvolucao();

    expect(pessoaTrajetoriaEtapaService.atualizar).toHaveBeenCalledWith(50, {
      seq_pessoa_trajetoria: 30,
      seq_trajetoria_etapa: 60,
      nu_situacao: SituacaoTrajetoria.NAO_INICIADA,
      dt_inicio: null,
      dt_conclusao: null,
      ds_observacao: 'Observação revisada',
      ds_motivo_pulo: null,
    });
    expect(pessoaTrajetoriaService.registrarEvolucao).not.toHaveBeenCalled();
  });

  it('salva a etapa antes da situação da Jornada, preservando os dois payloads', () => {
    const linha = criarLinha();
    abrirModal(linha);
    component.situacaoEtapaEvolucao = SituacaoTrajetoria.EM_ANDAMENTO;
    component.dataInicioEtapaEvolucao = '2026-07-24';
    component.situacaoJornadaEvolucao = SituacaoTrajetoria.EM_ANDAMENTO;

    component.registrarEvolucao();

    expect(pessoaTrajetoriaService.registrarEvolucao).toHaveBeenCalledWith(30, {
      seq_pessoa_trajetoria_etapa: 50,
      nu_situacao: SituacaoTrajetoria.EM_ANDAMENTO,
      dt_evento: '2026-07-24',
      ds_observacao: 'Observação atual',
      ds_motivo_pulo: null,
    });
    expect(pessoaTrajetoriaService.atualizar).toHaveBeenCalledWith(30, {
      seq_pessoa: 10,
      seq_trajetoria: 40,
      nu_situacao: SituacaoTrajetoria.EM_ANDAMENTO,
      dt_inicio: '2026-07-20',
      dt_conclusao: null,
      ds_observacao: null,
    });
    expect(pessoaTrajetoriaService.registrarEvolucao.mock.invocationCallOrder[0]).toBeLessThan(
      pessoaTrajetoriaService.atualizar.mock.invocationCallOrder[0],
    );
  });

  it('preserva o formulário e não emite sucesso quando a evolução falha', () => {
    pessoaTrajetoriaService.registrarEvolucao.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 409,
            error: { detail: 'Transição não permitida' },
          }),
      ),
    );
    const linha = criarLinha();
    const salvo = vi.fn();
    component.salvo.subscribe(salvo);
    abrirModal(linha);
    component.situacaoEtapaEvolucao = SituacaoTrajetoria.CONCLUIDA;
    component.dataConclusaoEtapaEvolucao = '2026-07-24';
    component.observacaoEvolucao = 'Manter este conteúdo';

    component.registrarEvolucao();

    expect(component.observacaoEvolucao).toBe('Manter este conteúdo');
    expect(component.erroEvolucao).toBe('Transição não permitida');
    expect(salvo).not.toHaveBeenCalled();
  });

  function abrirModal(linha: JornadaLinha): void {
    component.linhaEvolucao = linha;
    component.etapaEvolucao = linha.etapas[0];
    component.visivel = true;
    component.ngOnChanges({
      visivel: new SimpleChange(false, true, false),
    });
  }
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
      dh_inclusao: '2026-07-20T10:00:00',
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
          ds_observacao: 'Observação atual',
          ds_motivo_pulo: null,
        } as JornadaLinha['etapas'][number]['acompanhamento'],
      },
    ],
  };
}
