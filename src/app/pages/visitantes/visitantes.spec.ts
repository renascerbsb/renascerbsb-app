import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Visitantes } from './visitantes';

describe('Visitantes', () => {
  let component: Visitantes;
  let fixture: ComponentFixture<Visitantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Visitantes],
      providers: [ConfirmationService, MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(Visitantes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
