import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TelefoneMaskDirective } from '../../shared/directives/telefone-mask.directive';
import { MensagensApp } from '../../shared/constants/mensagens.constants';
import { Cidade, CidadeService } from '../../services/cidade.service';
import { Filial, FilialService } from '../../services/filial.service';
import { ComoConheceu } from '../../shared/enums/como-conheceu.enum';
import { Evento, EventoService } from '../../services/evento.service';
import { PessoaService, PessoaVisitanteCreate } from '../../services/pessoa.service';

@Component({
  selector: 'app-visitantes',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule,
    RadioButtonModule,
    SelectModule,
    TextareaModule,
    TelefoneMaskDirective
  ],
  templateUrl: './visitantes.html',
  styleUrl: './visitantes.scss',
})
export class Visitantes implements OnInit {
  form: FormGroup;
  filiais: Filial[] = [];
  bairros: Cidade[] = [];
  eventos: Evento[] = [];
  formasConhecimento = Object.values(ComoConheceu)
    .filter((valor): valor is ComoConheceu => typeof valor === 'number')
    .map(valor => ({
      label: this.formatarFormaConhecimento(valor),
      value: valor
    }));

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private cidadeService: CidadeService,
    private filialService: FilialService,
    private eventoService: EventoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      ds_nome: ['', Validators.required],
      seq_filial: [null, Validators.required],
      seq_cidade: [null, Validators.required],
      ds_nome_convidou: [''],
      ds_como_conheceu: [null, Validators.required],
      tp_genero: ['F', Validators.required],
      seq_evento_frequentou: [null],
      st_frequenta_igreja: [false, Validators.required],
      aceita_contato: [true, Validators.required],
      nr_telefone: [''],
      ds_observacao: ['']
    });
  }

  ngOnInit(): void {
    this.carregarFiliais();
    this.carregarBairros();
    this.carregarEventos();
  }

  carregarFiliais(): void {
    this.filialService.listar().subscribe({
      next: (dados) => {
        this.filiais = dados.filter(filial => filial.st_ativo);
      },
      error: (erro) => {
        console.error(MensagensApp.Visitantes_Error_BUSCAR_FILIAIS, erro);
      }
    });
  }

  carregarBairros(): void {
    this.cidadeService.listar().subscribe({
      next: (dados) => {
        this.bairros = dados
          .filter(cidade => cidade.st_ativo)
          .map(cidade => ({
            ...cidade,
            ds_nome: `${cidade.ds_nome} - ${cidade.uf}`
          }));
      },
      error: (erro) => {
        console.error(MensagensApp.Visitantes_Error_BUSCAR_CIDADES, erro);
      }
    });
  }

  carregarEventos(): void {
    this.eventoService.listar({ st_ativo: true }).subscribe({
      next: (dados) => {
        this.eventos = dados;
      },
      error: (erro) => {
        console.error(MensagensApp.Eventos_Error_BUSCAR_EVENTOS, erro);
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.confirmationService.confirm({
      header: 'Confirmar cadastro',
      message: 'Deseja cadastrar este visitante?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Salvar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.confirmarSalvar();
      }
    });
  }

  confirmarSalvar(): void {
    const dados = this.form.value;
    const payload: PessoaVisitanteCreate = {
      ds_nome: dados.ds_nome,
      nr_telefone: dados.nr_telefone || null,
      tp_genero: dados.tp_genero || null,
      seq_cidade: dados.seq_cidade || null,
      seq_filial: dados.seq_filial || null,
      ds_como_conheceu: dados.ds_como_conheceu,
      st_frequenta_igreja: dados.st_frequenta_igreja,
      aceita_contato: dados.aceita_contato,
      ds_nome_convidou: dados.ds_nome_convidou || null,
      seq_evento_frequentou: dados.seq_evento_frequentou || null,
      ds_observacao: dados.ds_observacao || null
    };

    this.pessoaService.criarVisitante(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: MensagensApp.Geral_Success_TITULO,
          detail: MensagensApp.Visitantes_Success_CADASTRO_REALIZADO
        });
        this.form.reset({
          tp_genero: 'F',
          st_frequenta_igreja: false,
          aceita_contato: true
        });
      }
    });
  }

  campoInvalido(nomeCampo: string): boolean {
    const campo = this.form.get(nomeCampo);
    return !!campo && campo.invalid && (campo.touched || campo.dirty);
  }

  private formatarFormaConhecimento(valor: ComoConheceu): string {
    const labels: Record<ComoConheceu, string> = {
      [ComoConheceu.CONVIDADO_MEMBRO]: 'Convidado por membro',
      [ComoConheceu.CONVIDADO_EXTERNO]: 'Convidado externo',
      [ComoConheceu.WHATSAPP]: 'WhatsApp',
      [ComoConheceu.INSTAGRAM]: 'Instagram',
      [ComoConheceu.GOOGLE_MAPS]: 'Google Maps',
      [ComoConheceu.CANAL_TV]: 'Canal de TV',
      [ComoConheceu.OUTROS]: 'Outros'
    };

    return labels[valor];
  }
}
