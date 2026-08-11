import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { IGNORAR_AUTENTICACAO, IGNORAR_REDIRECIONAMENTO_401 } from '../http/http-context.tokens';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const ignorarAutenticacao = req.context.get(IGNORAR_AUTENTICACAO);
  const ignorarRedirecionamento401 = req.context.get(IGNORAR_REDIRECIONAMENTO_401);
  const token = authService.getToken();
  const requisicao =
    token && !ignorarAutenticacao
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

  return next(requisicao).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (
        erro.status === 401 &&
        !ignorarAutenticacao &&
        !ignorarRedirecionamento401 &&
        !req.url.endsWith('/auth/login')
      ) {
        const returnUrl = router.url.startsWith('/login') ? '/inicio' : router.url;
        authService.logout();
        void router.navigate(['/login'], { queryParams: { returnUrl } });
      }

      if (erro.status === 403 && !ignorarAutenticacao && !req.url.endsWith('/auth/me')) {
        authService.atualizarUsuario().subscribe({ error: () => undefined });
      }

      return throwError(() => erro);
    }),
  );
};
