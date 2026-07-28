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
import { TextareaModule } from 'primeng/textarea';
import { finalize } from 'rxjs';

import {
  PessoaLiderLoteResponse,
  PessoaLiderService,
} from '../../../../services/pessoa-lider.service';
import { Pessoa } from '../../../../services/pessoa.service';

export interface PessoaSelecionadaLideranca {
  seq_pessoa: number;
  ds_nome: string;
}

@Component({
  selector: 'app-definir-lider-dialog',
  imports: [FormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TextareaModule],
  templateUrl: './definir-lider-dialog.html',
  styleUrl: './definir-lider-dialog.scss',
})
export class DefinirLiderDialog implements OnChanges {
  private readonly pessoaLiderService = inject(PessoaLiderService);
  private readonly messageService = inject(MessageService);

  @Input() visivel = false;
  @Input() pessoas: readonly PessoaSelecionadaLideranca[] = [];
  @Input() lideres: readonly Pessoa[] = [];

  @Output() fechar = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<PessoaLiderLoteResponse>();

  seqNovoLider: number | null = null;
  dataLideranca = this.hoje();
  observacaoLideranca = '';
  salvando = false;

  get lideresOpcoes(): Pessoa[] {
    return [...this.lideres];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel']?.currentValue && !changes['visivel'].previousValue) {
      this.limparFormulario();
    }
  }

  definirLider(): void {
    if (!this.seqNovoLider) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Revise os dados',
        detail: 'Selecione o novo líder.',
      });
      return;
    }
    if (!this.dataLideranca) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Revise os dados',
        detail: 'Informe a data de início.',
      });
      return;
    }

    this.salvando = true;
    this.pessoaLiderService
      .definirEmLote({
        seq_pessoas: this.pessoas.map((pessoa) => pessoa.seq_pessoa),
        seq_lider: this.seqNovoLider,
        dt_inicio: this.dataLideranca,
        ds_observacao: this.observacaoLideranca.trim() || null,
      })
      .pipe(finalize(() => (this.salvando = false)))
      .subscribe((resultado) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Liderança definida',
          detail: `Líder definido para ${resultado.quantidade} ${resultado.quantidade === 1 ? 'pessoa' : 'pessoas'}.`,
        });
        this.salvo.emit(resultado);
      });
  }

  solicitarFechamento(): void {
    if (!this.salvando) {
      this.fechar.emit();
    }
  }

  private limparFormulario(): void {
    this.seqNovoLider = null;
    this.dataLideranca = this.hoje();
    this.observacaoLideranca = '';
  }

  private hoje(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
