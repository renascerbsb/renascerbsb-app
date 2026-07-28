import { PessoaTrajetoriaEtapa } from '../../services/pessoa-trajetoria-etapa.service';
import {
  SITUACOES_TRAJETORIA,
  SituacaoTrajetoria,
} from '../../shared/enums/situacao-trajetoria.enum';
import { EtapaDaJornada, JornadaLinha } from './interfaces/jornada.models';

export function etapaEncerrada(etapa: PessoaTrajetoriaEtapa | null): boolean {
  return (
    !!etapa && [SituacaoTrajetoria.CONCLUIDA, SituacaoTrajetoria.PULADA].includes(etapa.nu_situacao)
  );
}

export function jornadaEncerrada(linha: JornadaLinha): boolean {
  return [SituacaoTrajetoria.CONCLUIDA, SituacaoTrajetoria.CANCELADA].includes(
    linha.pessoaTrajetoria.nu_situacao,
  );
}

export function etapaVencida(etapa: EtapaDaJornada): boolean {
  const acompanhamento = etapa.acompanhamento;
  const prazo = etapa.modelo.nr_prazo_dias;
  if (
    !acompanhamento?.dt_inicio ||
    acompanhamento.nu_situacao !== SituacaoTrajetoria.EM_ANDAMENTO ||
    prazo === null ||
    prazo === undefined ||
    prazo < 0
  ) {
    return false;
  }
  const vencimento = new Date(`${acompanhamento.dt_inicio}T00:00:00`);
  vencimento.setDate(vencimento.getDate() + prazo);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return hoje > vencimento;
}

export function proximaEtapa(linha: JornadaLinha): EtapaDaJornada | null {
  if (jornadaEncerrada(linha)) {
    return null;
  }
  return linha.etapas.find((etapa) => !etapaEncerrada(etapa.acompanhamento)) ?? null;
}

export function etapaParaEvolucao(linha: JornadaLinha): EtapaDaJornada | null {
  const etapaAberta = linha.etapas.find(
    (etapa) => !!etapa.acompanhamento && !etapaEncerrada(etapa.acompanhamento),
  );
  if (!jornadaEncerrada(linha)) {
    return etapaAberta ?? null;
  }
  if (linha.pessoaTrajetoria.nu_situacao === SituacaoTrajetoria.CANCELADA) {
    return (
      linha.etapas.find(
        (etapa) => etapa.acompanhamento?.nu_situacao === SituacaoTrajetoria.CANCELADA,
      ) ??
      etapaAberta ??
      null
    );
  }
  return [...linha.etapas].reverse().find((etapa) => etapaEncerrada(etapa.acompanhamento)) ?? null;
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

export function classeEtapa(etapa: EtapaDaJornada, linha: JornadaLinha): string {
  const situacao = etapa.acompanhamento?.nu_situacao;
  if (situacao === SituacaoTrajetoria.CONCLUIDA || situacao === SituacaoTrajetoria.PULADA) {
    return 'done';
  }
  if (etapaVencida(etapa)) {
    return 'overdue';
  }
  if (proximaEtapa(linha)?.modelo.seq_trajetoria_etapa === etapa.modelo.seq_trajetoria_etapa) {
    return situacao === SituacaoTrajetoria.PAUSADA ? 'paused' : 'current';
  }
  if (situacao === SituacaoTrajetoria.CANCELADA) {
    return 'cancelled';
  }
  return '';
}

export function tooltipEtapa(etapa: EtapaDaJornada): string {
  const situacao = etapa.acompanhamento
    ? nomeSituacao(etapa.acompanhamento.nu_situacao)
    : 'Sem acompanhamento';
  return `${etapa.modelo.ds_nome} · ${situacao}${etapaVencida(etapa) ? ' · Prazo vencido' : ''}`;
}

export function textoProximaAcao(linha: JornadaLinha): string {
  if (linha.pessoaTrajetoria.nu_situacao === SituacaoTrajetoria.CONCLUIDA) {
    return 'Jornada concluída';
  }
  if (linha.pessoaTrajetoria.nu_situacao === SituacaoTrajetoria.CANCELADA) {
    return 'Jornada cancelada';
  }
  return proximaEtapa(linha)?.modelo.ds_nome ?? 'Sem etapa pendente';
}
