import { HttpContextToken } from '@angular/common/http';

export const IGNORAR_AUTENTICACAO = new HttpContextToken<boolean>(() => false);
export const IGNORAR_TRATAMENTO_GLOBAL_DE_ERRO = new HttpContextToken<boolean>(() => false);
