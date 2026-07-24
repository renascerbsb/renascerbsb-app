import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

import { Pessoas } from './pessoas';
import { PessoaElegivelTrajetoria } from '../../services/pessoa-trajetoria.service';

describe('Pessoas', () => {
  let component: Pessoas;
  let fixture: ComponentFixture<Pessoas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pessoas],
      providers: [
        MessageService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Pessoas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve filtrar as pessoas elegíveis por nome e telefone', () => {
    component.pessoasElegiveis = [
      criarPessoaElegivel(1, 'Ana Cláudia', '61999990000'),
      criarPessoaElegivel(2, 'Bruno Silva', '61888880000'),
    ];

    component.pesquisaNomeJornada = 'ana claudia';
    expect(component.pessoasElegiveisFiltradas.map((pessoa) => pessoa.seq_pessoa)).toEqual([1]);

    component.pesquisaNomeJornada = '';
    component.pesquisaTelefoneJornada = '(61) 88888';
    expect(component.pessoasElegiveisFiltradas.map((pessoa) => pessoa.seq_pessoa)).toEqual([2]);
  });

  it('deve habilitar a confirmação somente com os dados obrigatórios', () => {
    const pessoa = criarPessoaElegivel(1, 'Ana Souza', '61999990000');

    expect(component.podeConfirmarJornada).toBe(false);

    component.jornadaEmLote.seqFilial = 1;
    component.jornadaEmLote.seqTrajetoria = 2;
    component.pessoasSelecionadas = [pessoa];

    expect(component.podeConfirmarJornada).toBe(true);
    expect(component.textoQuantidadeSelecionada).toBe('1 pessoa selecionada');
    expect(component.labelConfirmarJornada).toBe('Iniciar jornada para 1 pessoa');

    component.processandoJornada = true;
    expect(component.podeConfirmarJornada).toBe(false);
  });
});

function criarPessoaElegivel(
  seqPessoa: number,
  nome: string,
  telefone: string,
): PessoaElegivelTrajetoria {
  return {
    seq_pessoa: seqPessoa,
    ds_nome: nome,
    nr_telefone: telefone,
    tp_genero: null,
    dt_nascimento: null,
    seq_filial: 1,
    seq_vinculo: null,
    seq_faixa_etaria: null,
    seq_lider: null,
  };
}
