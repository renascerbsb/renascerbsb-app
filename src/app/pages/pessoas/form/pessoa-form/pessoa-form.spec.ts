import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from '../../../../services/auth.service';
import { CidadeService } from '../../../../services/cidade.service';
import { FilialService } from '../../../../services/filial.service';
import { MinisterioService } from '../../../../services/ministerio.service';
import { Pessoa, PessoaService } from '../../../../services/pessoa.service';
import { VinculoService } from '../../../../services/vinculo.service';
import { PessoaForm } from './pessoa-form';

describe('PessoaForm', () => {
  let component: PessoaForm;
  let fixture: ComponentFixture<PessoaForm>;
  let router: { navigate: ReturnType<typeof vi.fn> };
  let pessoaService: {
    listar: ReturnType<typeof vi.fn>;
    buscarPorId: ReturnType<typeof vi.fn>;
    criar: ReturnType<typeof vi.fn>;
    atualizar: ReturnType<typeof vi.fn>;
    formatarTelefone: ReturnType<typeof vi.fn>;
  };
  const usuarioAtual$ = new BehaviorSubject<null>(null);
  const authService = {
    usuarioAtual$,
    atualizarUsuario: vi.fn(() => of({})),
    podeEditarFilial: vi.fn(() => true),
  };

  beforeEach(async () => {
    router = { navigate: vi.fn(() => Promise.resolve(true)) };
    pessoaService = {
      listar: vi.fn(() => of([])),
      buscarPorId: vi.fn(() => of(criarPessoa())),
      criar: vi.fn(() => of(criarPessoa())),
      atualizar: vi.fn(() => of(criarPessoa())),
      formatarTelefone: vi.fn((telefone) => telefone ?? ''),
    };
    authService.podeEditarFilial.mockReturnValue(true);

    await TestBed.configureTestingModule({
      imports: [PessoaForm],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map(), routeConfig: null } },
        },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
        { provide: PessoaService, useValue: pessoaService },
        { provide: CidadeService, useValue: { listar: vi.fn(() => of([])) } },
        { provide: FilialService, useValue: { listarGestao: vi.fn(() => of([])) } },
        { provide: VinculoService, useValue: { listar: vi.fn(() => of([])) } },
        { provide: MinisterioService, useValue: { listar: vi.fn(() => of([])) } },
        {
          provide: ConfirmationService,
          useValue: { confirm: vi.fn((opcao) => opcao.accept()) },
        },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('criação e transferência exibem somente filiais editáveis', () => {
    component.filiaisGestao = [
      {
        seq_filial: 1,
        ds_nome: 'Editável',
        st_ativo: true,
        st_visualiza: true,
        st_edita: true,
      },
      {
        seq_filial: 2,
        ds_nome: 'Somente leitura',
        st_ativo: true,
        st_visualiza: true,
        st_edita: false,
      },
    ];

    expect(component.filiaisFormulario.map((filial) => filial.seq_filial)).toEqual([1]);
  });

  it('mantém a pessoa visível em modo somente leitura quando a filial não é editável', () => {
    component.pessoaAtual = criarPessoa();
    authService.podeEditarFilial.mockReturnValue(false);
    usuarioAtual$.next(null);

    expect(component.somenteLeituraPorPermissao).toBe(true);
    expect(component.form.disabled).toBe(true);
    expect(component.podeSalvar).toBe(false);
  });

  it('mantém o formulário aberto e informa a recusa 403 ao salvar', () => {
    component.filiaisGestao = [
      {
        seq_filial: 1,
        ds_nome: 'Sede',
        st_ativo: true,
        st_visualiza: true,
        st_edita: true,
      },
    ];
    component.form.patchValue({
      ds_nome: 'Ana',
      tp_genero: 'F',
      seq_filial: 1,
      seq_cidade: 1,
      seq_vinculo: 1,
    });
    pessoaService.criar.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 403 })));

    component.salvar();

    expect(component.erroSalvar).toContain('não possui permissão');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.salvando).toBe(false);
  });

  it('trata 404 individual como registro indisponível e volta à listagem', () => {
    component.pessoaId = '99';
    pessoaService.buscarPorId.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );

    component.carregarPessoa();

    expect(component.erroCarregamento).toContain('não está disponível');
    expect(router.navigate).toHaveBeenCalledWith(['/pessoas']);
  });
});

function criarPessoa(): Pessoa {
  return {
    seq_pessoa: 1,
    ds_nome: 'Ana',
    nr_telefone: null,
    tp_genero: 'F',
    dt_nascimento: null,
    seq_cidade: 1,
    seq_filial: 1,
    seq_vinculo: 1,
    seq_faixa_etaria: null,
    seq_lider: null,
    st_ativo: true,
    dh_inclusao: '2026-07-28T10:00:00',
    st_lider_restrito: false,
    ministerios: [],
  };
}
