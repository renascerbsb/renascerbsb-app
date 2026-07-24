import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';

import { EtapaTrajetoria, EtapaTrajetoriaService } from '../../services/etapa-trajetoria.service';
import {
  FilialTrajetoria,
  FilialTrajetoriaService,
} from '../../services/filial-trajetoria.service';
import { Filial, FilialService } from '../../services/filial.service';
import { TrajetoriaEtapa, TrajetoriaEtapaService } from '../../services/trajetoria-etapa.service';
import { Trajetoria, TrajetoriaService } from '../../services/trajetoria.service';
import { FormTrajetorias } from './form/form-trajetorias';
import { TrajetoriasMenu } from './trajetorias-menu';
import { TelaTrajetoria } from './trajetorias.types';

interface Opcao<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-trajetorias',
  imports: [
    DatePipe,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TooltipModule,
    FormTrajetorias,
    TrajetoriasMenu,
  ],
  templateUrl: './trajetorias.html',
  styleUrl: './trajetorias.component.scss',
})
export class Trajetorias implements OnInit {
  private readonly trajetoriaService = inject(TrajetoriaService);
  private readonly trajetoriaEtapaService = inject(TrajetoriaEtapaService);
  private readonly etapaTrajetoriaService = inject(EtapaTrajetoriaService);
  private readonly filialService = inject(FilialService);
  private readonly filialTrajetoriaService = inject(FilialTrajetoriaService);
  private readonly messageService = inject(MessageService);

  readonly situacoes: Opcao<string>[] = [
    { label: 'Todas', value: '' },
    { label: 'Ativas', value: 'true' },
    { label: 'Inativas', value: 'false' },
  ];

  tela: TelaTrajetoria = 'lista';
  trajetorias: Trajetoria[] = [];
  etapas: TrajetoriaEtapa[] = [];
  tiposEtapa: EtapaTrajetoria[] = [];
  filiais: Filial[] = [];
  filiaisTrajetorias: FilialTrajetoria[] = [];
  trajetoriaSelecionada: Trajetoria | null = null;
  trajetoriaDuplicada: Trajetoria | null = null;
  busca = '';
  situacao = '';
  filialFiltro: number | null = null;
  carregando = false;

  ngOnInit(): void {
    this.carregarDados();
  }

  get trajetoriasFiltradas(): Trajetoria[] {
    const termo = this.busca.trim().toLocaleLowerCase('pt-BR');
    return this.trajetorias.filter((trajetoria) => {
      const correspondeNome =
        !termo ||
        `${trajetoria.ds_nome} ${trajetoria.ds_descricao ?? ''}`
          .toLocaleLowerCase('pt-BR')
          .includes(termo);
      const correspondeSituacao =
        !this.situacao || String(trajetoria.st_ativo) === this.situacao;
      const correspondeFilial =
        !this.filialFiltro ||
        this.filiaisTrajetorias.some(
          (relacao) =>
            relacao.seq_trajetoria === trajetoria.seq_trajetoria &&
            relacao.seq_filial === this.filialFiltro &&
            relacao.st_ativo,
        );
      return correspondeNome && correspondeSituacao && correspondeFilial;
    });
  }

  get filiaisOpcoes(): Opcao<number>[] {
    return this.filiais
      .filter((filial) => filial.st_ativo)
      .map((filial) => ({ label: filial.ds_nome, value: filial.seq_filial }));
  }

  carregarDados(aposCarregar?: () => void): void {
    this.carregando = true;
    forkJoin({
      trajetoriasAtivas: this.trajetoriaService.listar({ st_ativo: true }),
      trajetoriasInativas: this.trajetoriaService.listar({ st_ativo: false }),
      etapas: this.trajetoriaEtapaService.listar({ st_ativo: true }),
      tiposAtivos: this.etapaTrajetoriaService.listar({ st_ativo: true }),
      tiposInativos: this.etapaTrajetoriaService.listar({ st_ativo: false }),
      filiais: this.filialService.listar(),
      relacoesAtivas: this.filialTrajetoriaService.listar({ st_ativo: true }),
      relacoesInativas: this.filialTrajetoriaService.listar({ st_ativo: false }),
    }).subscribe({
      next: (dados) => {
        this.trajetorias = [...dados.trajetoriasAtivas, ...dados.trajetoriasInativas].sort((a, b) =>
          a.ds_nome.localeCompare(b.ds_nome, 'pt-BR'),
        );
        this.etapas = dados.etapas;
        this.tiposEtapa = [...dados.tiposAtivos, ...dados.tiposInativos].sort((a, b) =>
          a.ds_nome.localeCompare(b.ds_nome, 'pt-BR'),
        );
        this.filiais = dados.filiais.sort((a, b) => a.ds_nome.localeCompare(b.ds_nome, 'pt-BR'));
        this.filiaisTrajetorias = [...dados.relacoesAtivas, ...dados.relacoesInativas];
        this.carregando = false;
        aposCarregar?.();
      },
      error: (erro: HttpErrorResponse) => {
        this.carregando = false;
        const detalhe =
          typeof erro.error?.detail === 'string'
            ? erro.error.detail
            : 'Tente novamente em instantes.';
        this.messageService.add({
          severity: 'error',
          summary: 'Não foi possível carregar as trajetórias.',
          detail: detalhe,
        });
      },
    });
  }

  navegar(tela: TelaTrajetoria): void {
    if (tela === this.tela) {
      return;
    }

    if (tela === 'lista') {
      this.tela = 'lista';
    } else if (tela === 'detalhes' && this.trajetoriaSelecionada) {
      this.tela = 'detalhes';
    } else if (tela === 'editor') {
      this.trajetoriaSelecionada
        ? this.editar(this.trajetoriaSelecionada)
        : this.novaTrajetoria();
    }
    this.irParaTopo();
  }

  visualizar(trajetoria: Trajetoria): void {
    this.trajetoriaSelecionada = trajetoria;
    this.trajetoriaDuplicada = null;
    this.tela = 'detalhes';
    this.irParaTopo();
  }

  novaTrajetoria(): void {
    this.trajetoriaSelecionada = null;
    this.trajetoriaDuplicada = null;
    this.tela = 'editor';
    this.irParaTopo();
  }

  editar(trajetoria: Trajetoria): void {
    this.trajetoriaSelecionada = trajetoria;
    this.trajetoriaDuplicada = null;
    this.tela = 'editor';
    this.irParaTopo();
  }

  duplicar(trajetoria: Trajetoria): void {
    this.trajetoriaSelecionada = null;
    this.trajetoriaDuplicada = trajetoria;
    this.tela = 'editor';
    this.irParaTopo();
  }

  cancelarFormulario(): void {
    this.tela = this.trajetoriaSelecionada ? 'detalhes' : 'lista';
    this.trajetoriaDuplicada = null;
  }

  aoSalvar(seqTrajetoria: number): void {
    this.carregarDados(() => {
      const atualizada = this.trajetorias.find(
        (trajetoria) => trajetoria.seq_trajetoria === seqTrajetoria,
      );
      if (atualizada) {
        this.visualizar(atualizada);
      }
    });
  }

  limparFiltros(): void {
    this.busca = '';
    this.situacao = '';
    this.filialFiltro = null;
  }

  quantidadeEtapas(trajetoria: Trajetoria): number {
    return this.etapasDaTrajetoria(trajetoria).length;
  }

  etapasDaTrajetoria(trajetoria: Trajetoria): TrajetoriaEtapa[] {
    return this.etapas
      .filter(
        (etapa) => etapa.seq_trajetoria === trajetoria.seq_trajetoria && etapa.st_ativo,
      )
      .sort((a, b) => a.nr_ordem - b.nr_ordem);
  }

  filiaisDaTrajetoria(trajetoria: Trajetoria): Filial[] {
    const ids = new Set(
      this.filiaisTrajetorias
        .filter(
          (relacao) => relacao.seq_trajetoria === trajetoria.seq_trajetoria && relacao.st_ativo,
        )
        .map((relacao) => relacao.seq_filial),
    );
    return this.filiais.filter((filial) => ids.has(filial.seq_filial));
  }

  private irParaTopo(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
