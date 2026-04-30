import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pessoa-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './pessoa-form.html',
  styleUrl: './pessoa-form.scss',
})
export class PessoaForm implements OnInit {
  form!: FormGroup;
  modoEdicao = false;
  pessoaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pessoaId = this.route.snapshot.paramMap.get('id');
    this.modoEdicao = !!this.pessoaId;

    this.form = this.fb.group({
      nome: ['', Validators.required],
      telefone: [''],
      dataNascimento: [''],
      sexo: [''],
      filial: ['Paranoá'],
      residencia: ['Sobradinho'],
      vinculos: [[]],
      observacoes: [''],
    });

    if (this.modoEdicao) {
      this.carregarPessoa();
    }
  }

  carregarPessoa(): void {
    // Mock temporário. Depois isso virá do backend.
    this.form.patchValue({
      nome: 'Vaevo Basuan',
      telefone: '(61) 99999-0000',
      dataNascimento: '1988-09-30',
      sexo: 'M',
      filial: 'Brasília',
      bairro: 'Santa Maria - DF',
      vinculos: ['Pastor', 'Líder de célula'],
      observacoes: 'Cadastro de exemplo para edição.',
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.value;

    if (this.modoEdicao) {
      console.log('Atualizando pessoa:', this.pessoaId, dados);
    } else {
      console.log('Incluindo pessoa:', dados);
    }

    this.router.navigate(['/pessoas']);
  }
}