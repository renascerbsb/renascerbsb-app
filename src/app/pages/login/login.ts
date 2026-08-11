import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { ApiWarmupService, EstadoAquecimentoApi } from '../../services/api-warmup.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, PasswordModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private apiWarmupService = inject(ApiWarmupService);
  private destroyRef = inject(DestroyRef);

  carregando = false;
  estadoAquecimento: EstadoAquecimentoApi = 'aquecendo';

  form = this.fb.group({
    ds_usuario: ['', Validators.required],
    ds_senha: ['', Validators.required],
  });

  ngOnInit(): void {
    this.apiWarmupService
      .aquecer()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((estado) => (this.estadoAquecimento = estado));
  }

  acessar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    const { ds_usuario, ds_senha } = this.form.getRawValue();

    this.authService
      .login({
        ds_usuario: ds_usuario ?? '',
        ds_senha: ds_senha ?? '',
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Acesso liberado',
            detail: 'Login realizado com sucesso.',
          });
          void this.router.navigateByUrl(this.obterDestinoAposLogin());
        },
        error: () => {
          this.carregando = false;
        },
        complete: () => {
          this.carregando = false;
        },
      });
  }

  campoInvalido(nomeCampo: 'ds_usuario' | 'ds_senha'): boolean {
    const campo = this.form.get(nomeCampo);
    return !!campo && campo.invalid && (campo.touched || campo.dirty);
  }

  private obterDestinoAposLogin(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    return returnUrl?.startsWith('/') &&
      !returnUrl.startsWith('//') &&
      !returnUrl.startsWith('/login')
      ? returnUrl
      : '/inicio';
  }
}
