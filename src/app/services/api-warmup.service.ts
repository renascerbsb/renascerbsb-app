import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, map, of, shareReplay, tap, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  IGNORAR_AUTENTICACAO,
  IGNORAR_TRATAMENTO_GLOBAL_DE_ERRO,
} from '../core/http/http-context.tokens';

export type EstadoAquecimentoApi = 'aquecendo' | 'pronta' | 'demorando';

@Injectable({ providedIn: 'root' })
export class ApiWarmupService {
  private readonly url = `${environment.apiUrl}/health/ready`;
  private readonly timeoutMs = 90_000;
  private readonly intervaloReutilizacaoMs = 5 * 60_000;
  private requisicaoEmAndamento$: Observable<EstadoAquecimentoApi> | null = null;
  private ultimoResultado: EstadoAquecimentoApi | null = null;
  private ultimaConclusaoEm = 0;

  constructor(private readonly http: HttpClient) {}

  aquecer(): Observable<EstadoAquecimentoApi> {
    if (this.requisicaoEmAndamento$) {
      return this.requisicaoEmAndamento$;
    }

    if (
      this.ultimoResultado &&
      Date.now() - this.ultimaConclusaoEm < this.intervaloReutilizacaoMs
    ) {
      return of(this.ultimoResultado);
    }

    const context = new HttpContext()
      .set(IGNORAR_AUTENTICACAO, true)
      .set(IGNORAR_TRATAMENTO_GLOBAL_DE_ERRO, true);

    const requisicao$ = this.http.get(this.url, { context }).pipe(
      timeout(this.timeoutMs),
      map((): EstadoAquecimentoApi => 'pronta'),
      catchError(() => of<EstadoAquecimentoApi>('demorando')),
      tap((resultado) => {
        this.ultimoResultado = resultado;
        this.ultimaConclusaoEm = Date.now();
      }),
      finalize(() => (this.requisicaoEmAndamento$ = null)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.requisicaoEmAndamento$ = requisicao$;
    return requisicao$;
  }
}
