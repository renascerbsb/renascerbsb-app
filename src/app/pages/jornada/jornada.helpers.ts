import {
  SITUACOES_TRAJETORIA,
  SituacaoTrajetoria,
} from '../../shared/enums/situacao-trajetoria.enum';
import { EtapaDaJornada, JornadaLinha } from './interfaces/jornada.models';

export function jornadaEncerrada(linha: JornadaLinha): boolean {
  return linha.jornada.st_concluida || linha.jornada.st_cancelada;
}

export function etapaParaEvolucao(linha: JornadaLinha): EtapaDaJornada | null {
  return linha.etapa_atual;
}

export function nomeSituacao(situacao: SituacaoTrajetoria): string {
  return SITUACOES_TRAJETORIA.find((item) => item.value === situacao)?.label ?? '-';
}

export function severidadeSituacao(
  situacao: SituacaoTrajetoria,
): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
  const mapa: Record<SituacaoTrajetoria, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
    [SituacaoTrajetoria.NAO_INICIADA]: 'secondary',
    [SituacaoTrajetoria.EM_ANDAMENTO]: 'info',
    [SituacaoTrajetoria.PAUSADA]: 'warn',
    [SituacaoTrajetoria.CONCLUIDA]: 'success',
    [SituacaoTrajetoria.CANCELADA]: 'danger',
    [SituacaoTrajetoria.PULADA]: 'secondary',
  };
  return mapa[situacao];
}

export function classeEtapa(etapa: EtapaDaJornada): string {
  if (etapa.st_vencida) {
    return 'overdue';
  }
  if (etapa.st_cancelada) {
    return 'cancelled';
  }
  if (etapa.st_atual) {
    return etapa.nu_situacao === SituacaoTrajetoria.PAUSADA ? 'paused' : 'current';
  }
  if (etapa.st_concluida || etapa.st_pulada) {
    return 'done';
  }
  return '';
}

export function tooltipEtapa(etapa: EtapaDaJornada): string {
  return `${etapa.ds_nome} · ${etapa.ds_situacao}${etapa.st_vencida ? ' · Prazo vencido' : ''}`;
}

export function textoProximaAcao(linha: JornadaLinha): string {
  if (linha.jornada.st_concluida) {
    return 'Jornada concluída';
  }
  if (linha.jornada.st_cancelada) {
    return 'Jornada cancelada';
  }
  return linha.proxima_acao?.ds_nome ?? 'Sem etapa pendente';
}
