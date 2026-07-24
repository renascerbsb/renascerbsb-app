import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { SituacaoTrajetoria } from '../shared/enums/situacao-trajetoria.enum';
import { PessoaTrajetoriaService } from './pessoa-trajetoria.service';

describe('PessoaTrajetoriaService - situações', () => {
  let service: PessoaTrajetoriaService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PessoaTrajetoriaService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('deve filtrar pelo novo campo nu_situacao', () => {
    service.listar({ nu_situacao: SituacaoTrajetoria.EM_ANDAMENTO }).subscribe();

    const requisicao = httpTesting.expectOne(
      (request) => request.url === `${environment.apiUrl}/pessoas-trajetorias/`,
    );
    expect(requisicao.request.method).toBe('GET');
    expect(requisicao.request.params.get('nu_situacao')).toBe('2');
    expect(requisicao.request.params.has('seq_situacao')).toBe(false);
    expect(requisicao.request.params.has('st_ativo')).toBe(false);
    requisicao.flush([]);
  });
});
