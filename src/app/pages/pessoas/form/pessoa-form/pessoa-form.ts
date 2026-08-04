import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TelefoneMaskDirective } from '../../../../shared/directives/telefone-mask.directive';
import { Cidade, CidadeService } from '../../../../services/cidade.service';
import { FilialGestao, FilialService } from '../../../../services/filial.service';
import { AuthService } from '../../../../services/auth.service';
import { Ministerio, MinisterioService } from '../../../../services/ministerio.service';
import {
  Pessoa,
  PessoaCreate,
  PessoaService,
  PessoaUpdate,
} from '../../../../services/pessoa.service';
import { Vinculo, VinculoService } from '../../../../services/vinculo.service';
import { MensagensApp } from '../../../../shared/constants/mensagens.constants';

@Component({
  selector: 'app-pessoa-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule,
    MultiSelectModule,
    RadioButtonModule,
    SelectModule,
    TextareaModule,
    TelefoneMaskDirective,
  ],
  templateUrl: './pessoa-form.html',
  styleUrl: './pessoa-form.scss',
})
export class PessoaForm implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  form!: FormGroup;
  modoEdicao = false;
  modoDetalhe = false;
  pessoaId: string | null = null;
  filiaisGestao: FilialGestao[] = [];
  residencias: Cidade[] = [];
  vinculos: Vinculo[] = [];
  ministerios: Ministerio[] = [];
  lideres: Pessoa[] = [];
  pessoaAtual: Pessoa | null = null;
  somenteLeituraPorPermissao = false;
  erroCarregamento = '';
  erroSalvar = '';
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pessoaService: PessoaService,
    private authService: AuthService,
    private cidadeService: CidadeService,
    private filialService: FilialService,
    private vinculoService: VinculoService,
    private ministerioService: MinisterioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.pessoaId = this.route.snapshot.paramMap.get('id');
    const rotaAtual = this.route.snapshot.routeConfig?.path || '';
    this.modoDetalhe = rotaAtual.includes('detalhar');
    this.modoEdicao = !!this.pessoaId && !this.modoDetalhe;

    this.form = this.fb.group({
      ds_nome: ['', Validators.required],
      nr_telefone: [''],
      dt_nascimento: [''],
      tp_genero: ['F', Validators.required],
      seq_filial: [null, Validators.required],
      seq_cidade: [null, Validators.required],
      seq_vinculo: [null, Validators.required],
      seq_lider: [null],
      seq_ministerios: [[]],
      observacoes: [''],
    });

    this.carregarListas();

    this.authService.usuarioAtual$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.atualizarModoPermissao());

    if (this.pessoaId) {
      this.authService.atualizarUsuario().subscribe({
        next: () => this.carregarPessoa(),
        error: () => this.carregarPessoa(),
      });
    } else {
      this.authService.atualizarUsuario().subscribe({ error: () => undefined });
    }
  }

  get filiaisFormulario(): FilialGestao[] {
    const editaveis = this.filiaisGestao.filter(
      (filial) =>
        filial.st_ativo && filial.st_edita && this.authService.podeEditarFilial(filial.seq_filial),
    );
    const seqAtual = this.pessoaAtual?.seq_filial;
    if (!this.somenteLeituraPorPermissao || !seqAtual) {
      return editaveis;
    }
    const atual = this.filiaisGestao.find((filial) => filial.seq_filial === seqAtual);
    return atual && !editaveis.some((filial) => filial.seq_filial === seqAtual)
      ? [atual, ...editaveis]
      : editaveis;
  }

  get semFiliaisEditaveis(): boolean {
    return !this.filiaisGestao.some(
      (filial) =>
        filial.st_ativo && filial.st_edita && this.authService.podeEditarFilial(filial.seq_filial),
    );
  }

  get podeSalvar(): boolean {
    return (
      !this.modoDetalhe &&
      !this.somenteLeituraPorPermissao &&
      !this.semFiliaisEditaveis &&
      !this.salvando
    );
  }

  get tituloPagina(): string {
    if (this.modoDetalhe) {
      return 'Detalhar pessoa';
    }

    if (this.modoEdicao) {
      return 'Editar pessoa';
    }

    return 'Cadastrar pessoa';
  }

  get subtituloPagina(): string {
    if (this.modoDetalhe) {
      return 'Confira os dados cadastrais da pessoa.';
    }

    if (this.modoEdicao) {
      return 'Atualize os dados cadastrais.';
    }

    return 'Informe os dados principais da pessoa.';
  }

  carregarListas(): void {
    this.cidadeService.listar().subscribe({
      next: (dados) => {
        this.residencias = dados
          .filter((cidade) => cidade.st_ativo)
          .map((cidade) => ({
            ...cidade,
            ds_nome: `${cidade.ds_nome} - ${cidade.uf}`,
          }));
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_CIDADES, erro);
      },
    });

    this.filialService.listarGestao().subscribe({
      next: (dados) => {
        this.filiaisGestao = dados.filter((filial) => filial.st_visualiza);
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_FILIAIS, erro);
      },
    });

    this.vinculoService.listar().subscribe({
      next: (dados) => {
        this.vinculos = dados.filter((vinculo) => vinculo.st_ativo);
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_VINCULOS, erro);
      },
    });

    this.ministerioService.listar().subscribe({
      next: (dados) => {
        this.ministerios = dados.filter((ministerio) => ministerio.st_ativo);
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_MINISTERIOS, erro);
      },
    });

    this.pessoaService.listar({ st_ativo: true }).subscribe({
      next: (dados) => {
        const seqPessoaAtual = this.pessoaId ? Number(this.pessoaId) : null;
        this.lideres = dados.filter((pessoa) => pessoa.seq_pessoa !== seqPessoaAtual);
      },
      error: (erro) => {
        console.error(MensagensApp.Pessoas_Error_BUSCAR_LIDERES, erro);
      },
    });
  }

  carregarPessoa(): void {
    if (!this.pessoaId) {
      return;
    }

    this.pessoaService.buscarPorId(Number(this.pessoaId)).subscribe({
      next: (pessoa) => {
        this.pessoaAtual = pessoa;
        this.form.patchValue({
          ds_nome: pessoa.ds_nome,
          nr_telefone: this.pessoaService.formatarTelefone(pessoa.nr_telefone),
          dt_nascimento: pessoa.dt_nascimento || '',
          tp_genero: pessoa.tp_genero || 'F',
          seq_filial: pessoa.seq_filial || null,
          seq_cidade: pessoa.seq_cidade || null,
          seq_vinculo: pessoa.seq_vinculo || null,
          seq_lider: pessoa.seq_lider || null,
          seq_ministerios: pessoa.ministerios?.map((ministerio) => ministerio.seq_ministerio) || [],
        });

        this.atualizarModoPermissao();
      },
      error: (erro: HttpErrorResponse) => {
        this.erroCarregamento =
          erro.status === 404
            ? 'Este registro não está disponível ou não pode ser localizado.'
            : MensagensApp.Pessoas_Error_BUSCAR_PESSOA;
        console.error(MensagensApp.Pessoas_Error_BUSCAR_PESSOA, erro);
        if (erro.status === 404) {
          void this.router.navigate(['/pessoas']);
        }
      },
    });
  }

  salvar(): void {
    this.erroSalvar = '';
    if (!this.podeSalvar) {
      return;
    }

    const seqFilial = this.form.get('seq_filial')?.value as number | null;
    if (!this.authService.podeEditarFilial(seqFilial)) {
      this.erroSalvar = 'Você não possui permissão para realizar esta operação nesta filial.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.confirmationService.confirm({
      header: this.modoEdicao ? 'Confirmar alteração' : 'Confirmar cadastro',
      message: this.modoEdicao
        ? 'Deseja salvar as alteracoes desta pessoa?'
        : 'Deseja cadastrar esta pessoa?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Salvar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.confirmarSalvar();
      },
    });
  }

  private confirmarSalvar(): void {
    const dados = this.form.value;
    const payload = {
      ds_nome: dados.ds_nome,
      nr_telefone: dados.nr_telefone || null,
      dt_nascimento: dados.dt_nascimento || null,
      tp_genero: dados.tp_genero || null,
      seq_cidade: dados.seq_cidade,
      seq_filial: dados.seq_filial,
      seq_vinculo: dados.seq_vinculo,
      seq_faixa_etaria: null,
      seq_lider: dados.seq_lider || null,
      seq_ministerios: dados.seq_ministerios || [],
    };

    const request =
      this.modoEdicao && this.pessoaId
        ? this.pessoaService.atualizar(Number(this.pessoaId), payload as PessoaUpdate)
        : this.pessoaService.criar(payload as PessoaCreate);

    this.salvando = true;
    request.subscribe({
      next: () => {
        this.salvando = false;
        this.messageService.add({
          severity: 'success',
          summary: MensagensApp.Geral_Success_TITULO,
          detail: this.modoEdicao
            ? MensagensApp.Pessoas_Success_ATUALIZACAO_REALIZADA
            : MensagensApp.Pessoas_Success_CADASTRO_REALIZADO,
        });
        this.router.navigate(['/pessoas']);
      },
      error: (erro: HttpErrorResponse) => {
        this.salvando = false;
        this.erroSalvar =
          erro.status === 403
            ? 'Você não possui permissão para realizar esta operação nesta filial.'
            : this.modoEdicao
              ? MensagensApp.Pessoas_Error_ATUALIZAR
              : MensagensApp.Pessoas_Error_INCLUIR;
        console.error(
          this.modoEdicao
            ? MensagensApp.Pessoas_Error_ATUALIZAR
            : MensagensApp.Pessoas_Error_INCLUIR,
          erro,
        );
      },
    });
  }

  campoInvalido(nomeCampo: string): boolean {
    const campo = this.form.get(nomeCampo);
    return !!campo && campo.invalid && (campo.touched || campo.dirty);
  }

  private atualizarModoPermissao(): void {
    if (!this.form) {
      return;
    }
    const seqFilial = this.pessoaAtual?.seq_filial;
    this.somenteLeituraPorPermissao =
      !!this.pessoaAtual && !this.authService.podeEditarFilial(seqFilial);
    if (this.modoDetalhe || this.somenteLeituraPorPermissao) {
      this.form.disable({ emitEvent: false });
    } else if (this.form.disabled) {
      this.form.enable({ emitEvent: false });
    }
  }
}
