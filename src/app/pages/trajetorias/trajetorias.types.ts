export type TelaTrajetoria = 'lista' | 'detalhes' | 'editor';

export type TelaFormularioTrajetoria = Exclude<TelaTrajetoria, 'lista'>;
