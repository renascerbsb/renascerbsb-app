import { Filial } from '../../../services/filial.service';
import { PessoaTrajetoriaEtapa } from '../../../services/pessoa-trajetoria-etapa.service';
import { PessoaTrajetoria } from '../../../services/pessoa-trajetoria.service';
import { Pessoa } from '../../../services/pessoa.service';
import { TrajetoriaEtapa } from '../../../services/trajetoria-etapa.service';
import { Trajetoria } from '../../../services/trajetoria.service';

export interface EtapaDaJornada {
  modelo: TrajetoriaEtapa;
  acompanhamento: PessoaTrajetoriaEtapa | null;
}

export interface JornadaLinha {
  pessoaTrajetoria: PessoaTrajetoria;
  pessoa: Pessoa;
  trajetoria: Trajetoria;
  filial: Filial | null;
  etapas: EtapaDaJornada[];
}
