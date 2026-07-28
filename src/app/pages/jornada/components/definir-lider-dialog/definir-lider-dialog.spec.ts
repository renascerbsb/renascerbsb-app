import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { PessoaLiderService } from '../../../../services/pessoa-lider.service';
import { Pessoa } from '../../../../services/pessoa.service';
import { DefinirLiderDialog } from './definir-lider-dialog';

describe('DefinirLiderDialog', () => {
  let fixture: ComponentFixture<DefinirLiderDialog>;
  let component: DefinirLiderDialog;
  let pessoaLiderService: { definirEmLote: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    pessoaLiderService = {
      definirEmLote: vi.fn(() => of({ seq_lider: 20, quantidade: 1, liderancas: [] })),
    };

    await TestBed.configureTestingModule({
      imports: [DefinirLiderDialog],
      providers: [
        { provide: PessoaLiderService, useValue: pessoaLiderService },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    })
      .overrideComponent(DefinirLiderDialog, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(DefinirLiderDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pessoas', [criarPessoa(10, 'Aldo')]);
    fixture.componentRef.setInput('lideres', [criarPessoa(20, 'Líder')]);
  });

  it('reinicia o formulário ao abrir', () => {
    component.seqNovoLider = 99;
    component.observacaoLideranca = 'Anterior';

    fixture.componentRef.setInput('visivel', true);
    fixture.detectChanges();

    expect(component.seqNovoLider).toBeNull();
    expect(component.observacaoLideranca).toBe('');
    expect(component.dataLideranca).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('emite fechamento sem alterar os dados recebidos', () => {
    const pessoas = [criarPessoa(10, 'Aldo')];
    fixture.componentRef.setInput('pessoas', pessoas);
    const fechar = vi.fn();
    component.fechar.subscribe(fechar);

    component.solicitarFechamento();

    expect(fechar).toHaveBeenCalledOnce();
    expect(pessoas).toEqual([criarPessoa(10, 'Aldo')]);
  });

  it('mantém o payload e emite o resultado após sucesso', () => {
    component.seqNovoLider = 20;
    component.dataLideranca = '2026-07-24';
    component.observacaoLideranca = 'Acompanhamento inicial';
    const salvo = vi.fn();
    component.salvo.subscribe(salvo);

    component.definirLider();

    expect(pessoaLiderService.definirEmLote).toHaveBeenCalledWith({
      seq_pessoas: [10],
      seq_lider: 20,
      dt_inicio: '2026-07-24',
      ds_observacao: 'Acompanhamento inicial',
    });
    expect(salvo).toHaveBeenCalledWith({
      seq_lider: 20,
      quantidade: 1,
      liderancas: [],
    });
  });
});

function criarPessoa(seqPessoa: number, nome: string): Pessoa {
  return {
    seq_pessoa: seqPessoa,
    ds_nome: nome,
    st_ativo: true,
    dh_inclusao: '2026-07-20T10:00:00',
  };
}
