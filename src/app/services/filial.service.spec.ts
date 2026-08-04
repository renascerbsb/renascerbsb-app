import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { FilialService } from './filial.service';

describe('FilialService', () => {
  let service: FilialService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FilialService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('carrega apenas as filiais disponíveis pelo endpoint de gestão', () => {
    service.listarGestao().subscribe((filiais) => expect(filiais).toHaveLength(1));

    const request = httpTesting.expectOne('http://127.0.0.1:8000/filiais/gestao');
    expect(request.request.method).toBe('GET');
    request.flush([
      {
        seq_filial: 1,
        ds_nome: 'Sede',
        st_ativo: true,
        st_visualiza: true,
        st_edita: false,
      },
    ]);
  });
});
