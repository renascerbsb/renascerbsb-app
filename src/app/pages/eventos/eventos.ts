import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Evento, EventoFiltros, EventoService } from '../../services/evento.service';
import { MensagensApp } from '../../shared/constants/mensagens.constants';

type FiltroValor = string | number | null;

@Component({
  selector: 'app-eventos',
  imports: [
    RouterLink,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule
  ],
  templateUrl: './eventos.html',
  styleUrl: './eventos.scss'
})
export class Eventos implements OnInit {
  eventos: Evento[] = [];
  recorrencias = [
    { label: 'Diario', value: 'DIARIO' },
    { label: 'Semanal', value: 'SEMANAL' },
    { label: 'Quinzenal', value: 'QUINZENAL' },
    { label: 'Mensal', value: 'MENSAL' },
    { label: 'Anual', value: 'ANUAL' }
  ];
  opcoesSimNao = [
    { label: 'Sim', value: 'true' },
    { label: 'Nao', value: 'false' },
    { label: 'Todos', value: '' }
  ];
  situacoes = [
    { label: 'Ativos', value: 'true' },
    { label: 'Inativos', value: 'false' },
    { label: 'Todos', value: '' }
  ];

  filtro = {
    seqEvento: null as FiltroValor,
    dsNome: '',
    stEventoFixo: '',
    dsRecorrencia: null as string | null,
    stAtivo: 'true'
  };

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    this.eventoService.listar(this.montarFiltros()).subscribe({
      next: (dados) => {
        this.eventos = dados;
      },
      error: (erro) => {
        console.error(MensagensApp.Eventos_Error_BUSCAR_EVENTOS, erro);
      }
    });
  }

  pesquisar(): void {
    this.carregarEventos();
  }

  limparFiltros(): void {
    this.filtro = {
      seqEvento: null,
      dsNome: '',
      stEventoFixo: '',
      dsRecorrencia: null,
      stAtivo: 'true'
    };

    this.carregarEventos();
  }

  obterRecorrencia(valor: string | null | undefined): string {
    return this.recorrencias.find(recorrencia => recorrencia.value === valor)?.label || '-';
  }

  private montarFiltros(): EventoFiltros {
    return {
      seq_evento: this.converterNumero(this.filtro.seqEvento),
      ds_nome: this.converterTexto(this.filtro.dsNome),
      st_evento_fixo: this.converterBooleano(this.filtro.stEventoFixo),
      ds_recorrencia: this.filtro.dsRecorrencia || null,
      st_ativo: this.converterBooleano(this.filtro.stAtivo)
    };
  }

  private converterNumero(valor: FiltroValor): number | null {
    return valor ? Number(valor) : null;
  }

  private converterTexto(valor: string): string | null {
    const texto = valor.trim();
    return texto || null;
  }

  private converterBooleano(valor: string): boolean | null {
    if (valor === 'true') {
      return true;
    }

    if (valor === 'false') {
      return false;
    }

    return null;
  }
}
