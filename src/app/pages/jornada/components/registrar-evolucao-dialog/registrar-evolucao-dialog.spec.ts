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

  it('carrega cópias dos dados agregados sem alterar a linha recebida', () => {
    const linha = criarLinha();
    abrirModal(linha);

    expect(component.situacaoEtapaEvolucao).toBe(SituacaoTrajetoria.NAO_INICIADA);
    expect(component.observacaoEvolucao).toBe('Observação atual');
    component.observacaoEvolucao = 'Cópia editada';
    expect(linha.progresso.etapas[0].ds_observacao).toBe('Observação atual');
  });

  it('mantém o POST de evolução por mudança de situação', () => {
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

  it('preserva o PUT existente quando somente os demais campos são alterados', () => {
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

  it('preserva a validação de observação exigida pela configuração da etapa', () => {
    const linha = criarLinha();
    abrirModal(linha, true);
    component.situacaoEtapaEvolucao = SituacaoTrajetoria.CONCLUIDA;
    component.dataConclusaoEtapaEvolucao = '2026-07-24';
    component.observacaoEvolucao = '';

    component.registrarEvolucao();

    expect(pessoaTrajetoriaService.registrarEvolucao).not.toHaveBeenCalled();
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

  function abrirModal(linha: JornadaLinha, exigeObservacao = false): void {
    component.linhaEvolucao = linha;
    component.etapaEvolucao = linha.etapa_atual;
    component.configuracaoEtapa = {
      seq_trajetoria_etapa: 60,
      seq_trajetoria: 40,
      seq_etapa_trajetoria: 1,
      ds_nome: 'Primeiro contato',
      nr_ordem: 1,
      st_obrigatoria: true,
      st_permite_pular: true,
      st_exige_observacao: exigeObservacao,
      st_ativo: true,
      seq_usuario_inclusao: 1,
      seq_usuario_alteracao: null,
      dh_inclusao: '2026-07-20T10:00:00',
      dh_alteracao: null,
    };
    component.visivel = true;
    component.ngOnChanges({ visivel: new SimpleChange(false, true, false) });
  }
});

function criarLinha(): JornadaLinha {
  const etapa = {
    seq_pessoa_trajetoria_etapa: 50,
    seq_trajetoria_etapa: 60,
    seq_etapa_trajetoria: 1,
    ds_nome: 'Primeiro contato',
    nr_ordem: 1,
    nu_situacao: SituacaoTrajetoria.NAO_INICIADA,
    ds_situacao: 'NAO_INICIADA',
    dt_inicio: null,
    dt_conclusao: null,
    ds_observacao: 'Observação atual',
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
      nu_situacao: SituacaoTrajetoria.NAO_INICIADA,
      ds_situacao: 'NAO_INICIADA',
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
