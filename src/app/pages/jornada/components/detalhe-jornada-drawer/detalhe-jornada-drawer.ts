import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, catchError, map, of, switchMap, tap } from 'rxjs';

import { PessoaTrajetoriaEtapa } from '../../../../services/pessoa-trajetoria-etapa.service';
import { PessoaTrajetoriaService } from '../../../../services/pessoa-trajetoria.service';
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
  imports: [CommonModule, ButtonModule, DrawerModule, TagModule, TooltipModule],
  templateUrl: './detalhe-jornada-drawer.html',
  styleUrl: './detalhe-jornada-drawer.scss',
})
export class DetalheJornadaDrawer implements OnChanges {
  private readonly destroyRef = inject(DestroyRef);
  private readonly pessoaTrajetoriaService = inject(PessoaTrajetoriaService);
  private readonly consultasHistorico$ = new Subject<number>();

  @Input() visivel = false;
  @Input() linha: JornadaLinha | null = null;
  @Input() podeEditar = false;

  @Output() fechar = new EventEmitter<void>();
  @Output() solicitarEvolucao = new EventEmitter<JornadaLinha>();

  aba: AbaDrawer = 'resumo';
  historico: PessoaTrajetoriaEtapa[] = [];
  carregando = false;
  erroHistorico = '';

  readonly nomeSituacao = nomeSituacao;
  readonly severidadeSituacao = severidadeSituacao;
  readonly classeEtapa = classeEtapa;
  readonly textoProximaAcao = textoProximaAcao;
  readonly jornadaEncerrada = jornadaEncerrada;
  readonly etapaParaEvolucao = etapaParaEvolucao;

  constructor() {
    this.consultasHistorico$
      .pipe(
        tap(() => {
          this.carregando = true;
          this.erroHistorico = '';
          this.historico = [];
        }),
        switchMap((id) =>
          this.pessoaTrajetoriaService.listarHistorico(id).pipe(
            map((historico) => ({ historico, erro: '' })),
            catchError(() => of({ historico: [], erro: 'Não foi possível carregar o histórico.' })),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ historico, erro }) => {
        this.carregando = false;
        this.historico = historico;
        this.erroHistorico = erro;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visivel']?.currentValue && !changes['visivel'].previousValue) {
      this.aba = 'resumo';
    }
    if (
      this.visivel &&
      this.linha &&
      (changes['linha'] || (changes['visivel']?.currentValue && !changes['visivel'].previousValue))
    ) {
      this.carregarHistorico();
    }
  }

  solicitarFechamento(): void {
    this.fechar.emit();
  }

  abrirEvolucao(): void {
    if (this.podeEditar && this.linha && etapaParaEvolucao(this.linha)) {
      this.solicitarEvolucao.emit(this.linha);
    }
  }

  nomeEtapa(seqEtapa: number): string {
    return (
      this.linha?.progresso.etapas.find((etapa) => etapa.seq_trajetoria_etapa === seqEtapa)
        ?.ds_nome ?? 'Etapa'
    );
  }

  private carregarHistorico(): void {
    const linha = this.linha;
    if (!linha) {
      return;
    }
    this.consultasHistorico$.next(linha.jornada.seq_pessoa_trajetoria);
  }
}
