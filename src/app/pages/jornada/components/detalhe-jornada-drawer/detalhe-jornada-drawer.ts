import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { finalize, forkJoin } from 'rxjs';

import { PessoaLider, PessoaLiderService } from '../../../../services/pessoa-lider.service';
import { PessoaTrajetoriaEtapa } from '../../../../services/pessoa-trajetoria-etapa.service';
import { PessoaTrajetoriaService } from '../../../../services/pessoa-trajetoria.service';
import { Pessoa } from '../../../../services/pessoa.service';
import { TrajetoriaEtapa } from '../../../../services/trajetoria-etapa.service';
import { JornadaLinha } from '../../interfaces/jornada.models';
import {
  classeEtapa,
  etapaParaEvolucao,
  jornadaEncerrada,
  nomeSituacao,
  severidadeSituacao,
  textoProximaAcao,
} from '../../jornada.helpers';

type AbaDrawer = 'resumo' | 'jornada' | 'historico' | 'lideranca';

@Component({
  selector: 'app-detalhe-jornada-drawer',
  imports: [CommonModule, ButtonModule, DrawerModule, TagModule],
  templateUrl: './detalhe-jornada-drawer.html',
  styleUrl: './detalhe-jornada-drawer.scss',
})
export class DetalheJornadaDrawer implements OnChanges {
  private readonly pessoaLiderService = inject(PessoaLiderService);
  private readonly pessoaTrajetoriaService = inject(PessoaTrajetoriaService);

  @Input() visivel = false;
  @Input() linha: JornadaLinha | null = null;
  @Input() pessoas: readonly Pessoa[] = [];
  @Input() etapasModelo: readonly TrajetoriaEtapa[] = [];

  @Output() fechar = new EventEmitter<void>();
  @Output() solicitarEvolucao = new EventEmitter<JornadaLinha>();

  aba: AbaDrawer = 'resumo';
  historico: PessoaTrajetoriaEtapa[] = [];
  historicoLideranca: PessoaLider[] = [];
  carregando = false;

  readonly nomeSituacao = nomeSituacao;
  readonly severidadeSituacao = severidadeSituacao;
  readonly classeEtapa = classeEtapa;
  readonly textoProximaAcao = textoProximaAcao;
  readonly jornadaEncerrada = jornadaEncerrada;
  readonly etapaParaEvolucao = etapaParaEvolucao;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel']?.currentValue && !changes['visivel'].previousValue) {
      this.aba = 'resumo';
    }
    if (
      this.visivel &&
      this.linha &&
      (changes['linha'] || (changes['visivel']?.currentValue && !changes['visivel'].previousValue))
    ) {
      this.carregarDetalhes();
    }
  }

  solicitarFechamento(): void {
    this.fechar.emit();
  }

  abrirEvolucao(): void {
    if (this.linha && etapaParaEvolucao(this.linha)) {
      this.solicitarEvolucao.emit(this.linha);
    }
  }

  nomeLider(seqLider: number): string {
    return (
      this.pessoas.find((pessoa) => pessoa.seq_pessoa === seqLider)?.ds_nome ??
      'Líder não encontrado'
    );
  }

  nomeEtapa(seqEtapa: number): string {
    return (
      this.etapasModelo.find((etapa) => etapa.seq_trajetoria_etapa === seqEtapa)?.ds_nome ?? 'Etapa'
    );
  }

  private carregarDetalhes(): void {
    const linha = this.linha;
    if (!linha) {
      return;
    }
    this.carregando = true;
    this.historico = [];
    this.historicoLideranca = [];
    forkJoin({
      historico: this.pessoaTrajetoriaService.listarHistorico(
        linha.pessoaTrajetoria.seq_pessoa_trajetoria,
      ),
      liderancasAtivas: this.pessoaLiderService.listar({
        seq_pessoa: linha.pessoa.seq_pessoa,
        st_ativo: true,
      }),
      liderancasInativas: this.pessoaLiderService.listar({
        seq_pessoa: linha.pessoa.seq_pessoa,
        st_ativo: false,
      }),
    })
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe(({ historico, liderancasAtivas, liderancasInativas }) => {
        this.historico = historico.sort(
          (a, b) =>
            this.ordemEtapa(a.seq_trajetoria_etapa) - this.ordemEtapa(b.seq_trajetoria_etapa),
        );
        this.historicoLideranca = [...liderancasAtivas, ...liderancasInativas].sort((a, b) =>
          b.dt_inicio.localeCompare(a.dt_inicio),
        );
      });
  }

  private ordemEtapa(seqEtapa: number): number {
    return (
      this.etapasModelo.find((etapa) => etapa.seq_trajetoria_etapa === seqEtapa)?.nr_ordem ??
      Number.MAX_SAFE_INTEGER
    );
  }
}
