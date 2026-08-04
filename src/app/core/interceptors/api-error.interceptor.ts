import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { MensagensApp } from '../../shared/constants/mensagens.constants';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      messageService.add({
        severity: 'error',
        summary: MensagensApp.Geral_Error_TITULO,
        detail: obterMensagemErro(erro),
      });

      return throwError(() => erro);
    }),
  );
};

function obterMensagemErro(erro: HttpErrorResponse): string {
  if (erro.status === 0) {
    return MensagensApp.Geral_Error_API_INDISPONIVEL;
  }

  if (erro.status === 403) {
    return 'Você não possui permissão para realizar esta operação nesta filial.';
  }

  if (erro.status === 404) {
    return 'Este registro não está disponível ou não pode ser localizado.';
  }

  if (typeof erro.error === 'string' && erro.error.trim()) {
    return erro.error;
  }

  if (erro.error?.detail) {
    return Array.isArray(erro.error.detail)
      ? erro.error.detail.map((item: unknown) => formatarDetalhe(item)).join(' ')
      : String(erro.error.detail);
  }

  if (erro.error?.message) {
    return String(erro.error.message);
  }

  return MensagensApp.Geral_Error_API;
}

function formatarDetalhe(detalhe: unknown): string {
  if (typeof detalhe === 'string') {
    return detalhe;
  }

  if (detalhe && typeof detalhe === 'object' && 'msg' in detalhe) {
    return String((detalhe as { msg: unknown }).msg);
  }

  return JSON.stringify(detalhe);
}
