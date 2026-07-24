export enum SituacaoTrajetoria {
  NAO_INICIADA = 1,
  EM_ANDAMENTO = 2,
  PAUSADA = 3,
  CONCLUIDA = 4,
  CANCELADA = 5,
  PULADA = 6,
}

export const SITUACOES_TRAJETORIA = [
  { label: 'Não iniciada', value: SituacaoTrajetoria.NAO_INICIADA },
  { label: 'Em andamento', value: SituacaoTrajetoria.EM_ANDAMENTO },
  { label: 'Pausada', value: SituacaoTrajetoria.PAUSADA },
  { label: 'Concluída', value: SituacaoTrajetoria.CONCLUIDA },
  { label: 'Cancelada', value: SituacaoTrajetoria.CANCELADA },
  { label: 'Pulada', value: SituacaoTrajetoria.PULADA },
] as const;
