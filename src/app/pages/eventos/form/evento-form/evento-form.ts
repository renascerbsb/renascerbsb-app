import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { EventoService } from '../../../../services/evento.service';
import { MensagensApp } from '../../../../shared/constants/mensagens.constants';

@Component({
  selector: 'app-evento-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    ToggleSwitchModule
  ],
  templateUrl: './evento-form.html',
  styleUrl: './evento-form.scss'
})
export class EventoForm implements OnInit {
  form!: FormGroup;
  modoEdicao = false;
  eventoId: string | null = null;
  recorrencias = [
    { label: 'Diario', value: 'DIARIO' },
    { label: 'Semanal', value: 'SEMANAL' },
    { label: 'Quinzenal', value: 'QUINZENAL' },
    { label: 'Mensal', value: 'MENSAL' },
    { label: 'Anual', value: 'ANUAL' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    this.eventoId = this.route.snapshot.paramMap.get('id');
    this.modoEdicao = !!this.eventoId;

    this.form = this.fb.group({
      ds_nome: ['', Validators.required],
      ds_descricao: [''],
      st_evento_fixo: [false],
      ds_recorrencia: [null],
      st_ativo: [true]
    });

    if (this.modoEdicao) {
      this.carregarEvento();
    }
  }

  carregarEvento(): void {
    if (!this.eventoId) {
      return;
    }

    this.eventoService.buscarPorId(Number(this.eventoId)).subscribe({
      next: (evento) => {
        this.form.patchValue({
          ds_nome: evento.ds_nome,
          ds_descricao: evento.ds_descricao || '',
          st_evento_fixo: evento.st_evento_fixo,
          ds_recorrencia: evento.ds_recorrencia || null,
          st_ativo: evento.st_ativo
        });
      },
      error: (erro) => {
        console.error(MensagensApp.Eventos_Error_BUSCAR_EVENTO, erro);
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.value;
    const payload = this.modoEdicao ? {
      ds_nome: dados.ds_nome,
      ds_descricao: dados.ds_descricao || null,
      st_evento_fixo: dados.st_evento_fixo,
      ds_recorrencia: dados.ds_recorrencia || null,
      st_ativo: dados.st_ativo
    } : {
      ds_nome: dados.ds_nome,
      ds_descricao: dados.ds_descricao || null,
      st_evento_fixo: dados.st_evento_fixo,
      ds_recorrencia: dados.ds_recorrencia || null
    };

    const request = this.modoEdicao && this.eventoId
      ? this.eventoService.atualizar(Number(this.eventoId), payload)
      : this.eventoService.criar(payload);

    request.subscribe({
      next: () => {
        this.router.navigate(['/eventos']);
      },
      error: (erro) => {
        console.error(this.modoEdicao ? MensagensApp.Eventos_Error_ATUALIZAR : MensagensApp.Eventos_Error_INCLUIR, erro);
      }
    });
  }
}
