import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, map, of, switchMap } from 'rxjs';
import { AuthService, EstadoValidacaoSessao } from '../../services/auth.service';
import { ApiWarmupService } from '../../services/api-warmup.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);

  return verificarSessao().pipe(
    map((estado) =>
      estado === 'autenticada'
        ? true
        : router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url },
          }),
    ),
  );
};

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);

  return verificarSessao().pipe(
    map((estado) => (estado === 'autenticada' ? router.createUrlTree(['/inicio']) : true)),
  );
};

function verificarSessao(): Observable<EstadoValidacaoSessao> {
  const authService = inject(AuthService);
  const apiWarmupService = inject(ApiWarmupService);

  if (!authService.temSessaoLocalValida()) {
    return of('nao-autenticada');
  }

  return apiWarmupService.aquecer().pipe(switchMap(() => authService.validarSessao()));
}
