import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Observable, concatMap, finalize, of } from 'rxjs';

import { PessoaTrajetoriaEtapaService } from '../../../../services/pessoa-trajetoria-etapa.service';
import {
  PessoaTrajetoria,
  PessoaTrajetoriaService,
} from '../../../../services/pessoa-trajetoria.service';
import { TrajetoriaEtapa } from '../../../../services/trajetoria-etapa.service';
import {
  SITUACOES_TRAJETORIA,
  SituacaoTrajetoria,
} from '../../../../shared/enums/situacao-trajetoria.enum';
import { EtapaDaJornada, JornadaLinha } from '../../interfaces/jornada.models';
import {
  classeEtapa,
  jornadaEncerrada,
  nomeSituacao,
  severidadeSituacao,
} from '../../jornada.helpers';

interface Opcao<T> {
  label: string;
  value: T;
  disabled?: boolean;
}

@Component({
  selector: 'app-registrar-evolucao-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TextareaModule,
  ],
  templateUrl: './registrar-evolucao-dialog.html',
  styleUrl: './registrar-evolucao-dialog.scss',
})
export class RegistrarEvolucaoDialog implements OnChanges {
  private readonly pessoaTrajetoriaService = inject(PessoaTrajetoriaService);
  private readonly pessoaTrajetoriaEtapaService = inject(PessoaTrajetoriaEtapaService);
  private readonly messageService = inject(MessageService);

  @Input() visivel = false;
  @Input() linhaEvolucao: JornadaLinha | null = null;
  @Input() etapaEvolucao: EtapaDaJornada | null = null;
  @Input() configuracaoEtapa: TrajetoriaEtapa | null = null;
  @Input() podeEditar = true;

  @Output() fechar = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<void>();

  readonly situacoesJornadaEvolucao: Opcao<SituacaoTrajetoria>[] = SITUACOES_TRAJETORIA.filter(
    (item) => item.value !== SituacaoTrajetoria.PULADA,
  ).map((item) => ({
    ...item,
    disabled: item.value === SituacaoTrajetoria.CONCLUIDA,
  }));

  situacaoJornadaEvolucao: SituacaoTrajetoria = SituacaoTrajetoria.NAO_INICIADA;
  dataConclusaoJornadaEvolucao: string | null = null;
  situacaoEtapaEvolucao: SituacaoTrajetoria = SituacaoTrajetoria.NAO_INICIADA;
  dataInicioEtapaEvolucao: string | null = null;
  dataConclusaoEtapaEvolucao: string | null = null;
  observacaoEvolucao = '';
  motivoPulo = '';
  erroEvolucao = '';
  salvandoEvolucao = false;

  readonly nomeSituacao = nomeSituacao;
  readonly severidadeSituacao = severidadeSituacao;
  readonly classeEtapa = classeEtapa;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['visivel']?.currentValue && !changes['visivel'].previousValue) ||
      (this.visivel && (changes['linhaEvolucao'] || changes['etapaEvolucao']))
    ) {
      this.carregarFormulario();
    }
  }

  get modoConsultaEvolucao(): boolean {
    return !this.podeEditar || (!!this.linhaEvolucao && jornadaEncerrada(this.linhaEvolucao));
  }

  get jornadaFoiAlterada(): boolean {
    return (
      !!this.linhaEvolucao &&
      this.situacaoJornadaEvolucao !== this.linhaEvolucao.jornada.nu_situacao
    );
  }

  get etapaFoiAlterada(): boolean {
    const atual = this.etapaEvolucao;
    return (
      !!atual &&
      (this.situacaoEtapaEvolucao !== atual.nu_situacao ||
        this.dataInicioEtapaEvolucao !== atual.dt_inicio ||
        this.dataConclusaoEtapaEvolucao !== atual.dt_conclusao ||
        this.observacaoEvolucao.trim() !== (atual.ds_observacao ?? '') ||
        (this.situacaoEtapaEvolucao === SituacaoTrajetoria.PULADA
          ? this.motivoPulo.trim() !== (atual.ds_motivo_pulo ?? '')
          : !!atual.ds_motivo_pulo))
    );
  }

  get podeEditarDataInicioEtapa(): boolean {
    const situacaoAtual = this.etapaEvolucao?.nu_situacao;
    return (
      !this.modoConsultaEvolucao &&
      !this.salvandoEvolucao &&
      (this.situacaoEtapaEvolucao === situacaoAtual ||
        this.situacaoEtapaEvolucao === SituacaoTrajetoria.EM_ANDAMENTO)
    );
  }

  get situacoesEtapaEvolucao(): Opcao<SituacaoTrajetoria>[] {
    const atual = this.etapaEvolucao?.nu_situacao;
    if (!atual) {
      return [];
    }
    const transicoes: Partial<Record<SituacaoTrajetoria, SituacaoTrajetoria[]>> = {
      [SituacaoTrajetoria.NAO_INICIADA]: [
        SituacaoTrajetoria.EM_ANDAMENTO,
        SituacaoTrajetoria.CONCLUIDA,
        SituacaoTrajetoria.CANCELADA,
        SituacaoTrajetoria.PULADA,
      ],
      [SituacaoTrajetoria.EM_ANDAMENTO]: [
        SituacaoTrajetoria.PAUSADA,
        SituacaoTrajetoria.CONCLUIDA,
        SituacaoTrajetoria.CANCELADA,
        SituacaoTrajetoria.PULADA,
      ],
      [SituacaoTrajetoria.PAUSADA]: [
        SituacaoTrajetoria.EM_ANDAMENTO,
        SituacaoTrajetoria.CANCELADA,
        SituacaoTrajetoria.PULADA,
      ],
    };
    const permitidas = new Set([atual, ...(transicoes[atual] ?? [])]);
    return SITUACOES_TRAJETORIA.filter((item) => permitidas.has(item.value)).map((item) => ({
      ...item,
      disabled:
        item.value === SituacaoTrajetoria.PULADA && !this.configuracaoEtapa?.st_permite_pular,
    }));
  }

  registrarEvolucao(): void {
    const linha = this.linhaEvolucao;
    const etapa = this.etapaEvolucao;
    if (!this.podeEditar || !linha || !etapa || !this.configuracaoEtapa) {
      return;
    }
    if (this.modoConsultaEvolucao || !this.validarEvolucao()) {
      return;
    }

    const etapaAlterada = this.etapaFoiAlterada;
    const jornadaAlterada = this.jornadaFoiAlterada;
    if (!etapaAlterada && !jornadaAlterada) {
      this.exibirValidacaoEvolucao('Nenhuma alteração foi informada.');
      return;
    }

    this.salvandoEvolucao = true;
    this.salvarEtapaAtual(linha, etapa, etapaAlterada)
      .pipe(concatMap(() => this.salvarSituacaoJornada(linha, jornadaAlterada)))
      .pipe(finalize(() => (this.salvandoEvolucao = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: etapaAlterada ? 'Evolução registrada' : 'Jornada atualizada',
            detail:
              etapaAlterada && jornadaAlterada
                ? 'Jornada e etapa atualizadas com sucesso.'
                : etapaAlterada
                  ? 'Evolução registrada com sucesso.'
                  : 'Situação da jornada atualizada com sucesso.',
          });
          this.salvo.emit();
        },
        error: (erro: HttpErrorResponse) => {
          this.erroEvolucao = this.obterMensagemErro(erro);
          this.messageService.add({
            severity: 'error',
            summary: 'Não foi possível registrar a evolução',
            detail: this.erroEvolucao,
          });
        },
      });
  }

  solicitarFechamento(): void {
    if (!this.salvandoEvolucao) {
      this.fechar.emit();
    }
  }

  private carregarFormulario(): void {
    const linha = this.linhaEvolucao;
    const acompanhamento = this.etapaEvolucao;
    if (!linha || !acompanhamento) {
      return;
    }
    this.situacaoJornadaEvolucao = linha.jornada.nu_situacao;
    this.dataConclusaoJornadaEvolucao = linha.jornada.dt_conclusao;
    this.situacaoEtapaEvolucao = acompanhamento.nu_situacao;
    this.dataInicioEtapaEvolucao = acompanhamento.dt_inicio;
    this.dataConclusaoEtapaEvolucao = acompanhamento.dt_conclusao;
    this.observacaoEvolucao = acompanhamento.ds_observacao ?? '';
    this.motivoPulo = acompanhamento.ds_motivo_pulo ?? '';
    this.erroEvolucao = '';
  }

  private validarEvolucao(): boolean {
    const etapa = this.etapaEvolucao;
    if (!etapa || !this.configuracaoEtapa) {
      return false;
    }
    const situacao = this.situacaoEtapaEvolucao;
    const iniciada = [SituacaoTrajetoria.EM_ANDAMENTO, SituacaoTrajetoria.PAUSADA].includes(
      situacao,
    );
    const encerrada = [
      SituacaoTrajetoria.CONCLUIDA,
      SituacaoTrajetoria.CANCELADA,
      SituacaoTrajetoria.PULADA,
    ].includes(situacao);
    if (iniciada && !this.dataInicioEtapaEvolucao) {
      return this.exibirValidacaoEvolucao('Informe a data de início da etapa.');
    }
    if (encerrada && !this.dataConclusaoEtapaEvolucao) {
      return this.exibirValidacaoEvolucao('Informe a data de conclusão da etapa.');
    }
    if (
      this.dataInicioEtapaEvolucao &&
      this.dataConclusaoEtapaEvolucao &&
      this.dataConclusaoEtapaEvolucao < this.dataInicioEtapaEvolucao
    ) {
      return this.exibirValidacaoEvolucao(
        'A data de conclusão deve ser igual ou posterior à data de início.',
      );
    }
    if (situacao === SituacaoTrajetoria.PULADA && !this.motivoPulo.trim()) {
      return this.exibirValidacaoEvolucao('Informe o motivo do pulo.');
    }
    if (
      this.configuracaoEtapa.st_exige_observacao &&
      [SituacaoTrajetoria.CONCLUIDA, SituacaoTrajetoria.PULADA].includes(situacao) &&
      !this.observacaoEvolucao.trim()
    ) {
      return this.exibirValidacaoEvolucao('Esta etapa exige uma observação.');
    }
    if (
      this.jornadaFoiAlterada &&
      [SituacaoTrajetoria.CONCLUIDA, SituacaoTrajetoria.CANCELADA].includes(
        this.situacaoJornadaEvolucao,
      ) &&
      !this.dataConclusaoJornadaEvolucao
    ) {
      return this.exibirValidacaoEvolucao('Informe a data de conclusão da jornada.');
    }
    return true;
  }

  private salvarEtapaAtual(
    linha: JornadaLinha,
    etapa: EtapaDaJornada,
    alterada: boolean,
  ): Observable<unknown> {
    const acompanhamento = etapa;
    if (!alterada) {
      return of(null);
    }
    if (this.situacaoEtapaEvolucao !== acompanhamento.nu_situacao) {
      const dataEvento =
        this.situacaoEtapaEvolucao === SituacaoTrajetoria.EM_ANDAMENTO
          ? this.dataInicioEtapaEvolucao
          : (this.dataConclusaoEtapaEvolucao ?? this.dataInicioEtapaEvolucao);
      if (!dataEvento) {
        return of(null);
      }
      return this.pessoaTrajetoriaService.registrarEvolucao(linha.jornada.seq_pessoa_trajetoria, {
        seq_pessoa_trajetoria_etapa: acompanhamento.seq_pessoa_trajetoria_etapa,
        nu_situacao: this.situacaoEtapaEvolucao,
        dt_evento: dataEvento,
        ds_observacao: this.observacaoEvolucao.trim() || null,
        ds_motivo_pulo:
          this.situacaoEtapaEvolucao === SituacaoTrajetoria.PULADA ? this.motivoPulo.trim() : null,
      });
    }
    return this.pessoaTrajetoriaEtapaService.atualizar(acompanhamento.seq_pessoa_trajetoria_etapa, {
      seq_pessoa_trajetoria: linha.jornada.seq_pessoa_trajetoria,
      seq_trajetoria_etapa: acompanhamento.seq_trajetoria_etapa,
      nu_situacao: this.situacaoEtapaEvolucao,
      dt_inicio: this.dataInicioEtapaEvolucao,
      dt_conclusao: this.dataConclusaoEtapaEvolucao,
      ds_observacao: this.observacaoEvolucao.trim() || null,
      ds_motivo_pulo:
        this.situacaoEtapaEvolucao === SituacaoTrajetoria.PULADA ? this.motivoPulo.trim() : null,
    });
  }

  private salvarSituacaoJornada(
    linha: JornadaLinha,
    alterada: boolean,
  ): Observable<PessoaTrajetoria | null> {
    if (!alterada) {
      return of(null);
    }
    const encerrada = [SituacaoTrajetoria.CONCLUIDA, SituacaoTrajetoria.CANCELADA].includes(
      this.situacaoJornadaEvolucao,
    );
    return this.pessoaTrajetoriaService.atualizar(linha.jornada.seq_pessoa_trajetoria, {
      seq_pessoa: linha.pessoa.seq_pessoa,
      seq_trajetoria: linha.jornada.seq_trajetoria,
      nu_situacao: this.situacaoJornadaEvolucao,
      dt_inicio: linha.jornada.dt_inicio,
      dt_conclusao: encerrada ? this.dataConclusaoJornadaEvolucao : null,
      ds_observacao: linha.jornada.ds_observacao,
    });
  }

  private exibirValidacaoEvolucao(detalhe: string): false {
    this.messageService.add({ severity: 'warn', summary: 'Revise os dados', detail: detalhe });
    return false;
  }

  private obterMensagemErro(erro: HttpErrorResponse): string {
    if (erro.status === 403) {
      return 'Você não possui permissão para realizar esta operação nesta filial.';
    }
    if (erro.status === 404) {
      return 'Este registro não está disponível ou não pode ser localizado.';
    }
    if (typeof erro.error?.detail === 'string' && erro.error.detail.trim()) {
      return erro.error.detail;
    }
    if (Array.isArray(erro.error?.detail)) {
      const mensagens = erro.error.detail
        .map((item: { msg?: unknown }) => (typeof item?.msg === 'string' ? item.msg : ''))
        .filter(Boolean);
      if (mensagens.length) {
        return mensagens.join(' ');
      }
    }
    return 'Não foi possível salvar as alterações. Tente novamente.';
  }
}
