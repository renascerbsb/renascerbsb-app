import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { PessoaLiderLoteCreate, PessoaLiderService } from './pessoa-lider.service';

describe('PessoaLiderService', () => {
  let service: PessoaLiderService;
  let httpTesting: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PessoaLiderService);
    httpTesting = TestBed.inject(HttpTestingController);
  });
  afterEach(() => httpTesting.verify());

  it('deve definir o líder em lote em uma única requisição', () => {
    const payload: PessoaLiderLoteCreate = {
      seq_pessoas: [10, 11],
      seq_lider: 20,
      dt_inicio: '2026-07-22',
      ds_observacao: null,
    };
    service.definirEmLote(payload).subscribe();
    const requisicao = httpTesting.expectOne(`${environment.apiUrl}/pessoas-lideres/lote`);
    expect(requisicao.request.method).toBe('POST');
    expect(requisicao.request.body).toEqual(payload);
    requisicao.flush({ seq_lider: 20, quantidade: 2, liderancas: [] });
  });
});
