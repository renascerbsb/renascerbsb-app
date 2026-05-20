import { TestBed } from '@angular/core/testing';

import { VinculoService } from './vinculo.service';

describe('VinculoService', () => {
  let service: VinculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VinculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
