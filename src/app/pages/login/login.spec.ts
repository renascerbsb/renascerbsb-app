import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, of } from 'rxjs';
import { ApiWarmupService, EstadoAquecimentoApi } from '../../services/api-warmup.service';
import { AuthService } from '../../services/auth.service';
import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let estadosAquecimento: Subject<EstadoAquecimentoApi>;
  let apiWarmupService: { aquecer: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    estadosAquecimento = new Subject<EstadoAquecimentoApi>();
    apiWarmupService = {
      aquecer: vi.fn(() => estadosAquecimento.asObservable()),
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: ApiWarmupService, useValue: apiWarmupService },
        { provide: AuthService, useValue: { login: vi.fn(() => of(undefined)) } },
        { provide: Router, useValue: { navigateByUrl: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: vi.fn(() => null) } } },
        },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('inicia o aquecimento ao abrir e exibe a mensagem enquanto aguarda', () => {
    expect(apiWarmupService.aquecer).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.textContent).toContain(
      'Iniciando o sistema. O primeiro acesso pode levar alguns instantes.',
    );
    expect(fixture.nativeElement.querySelector('.pi-spinner')).toBeTruthy();
  });

  it('remove automaticamente a mensagem e o indicador após o sucesso', () => {
    estadosAquecimento.next('pronta');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.warmup-status')).toBeNull();
  });

  it('mostra a demora sem bloquear nem limpar o formulário', () => {
    component.form.setValue({ ds_usuario: 'admin', ds_senha: '123' });

    estadosAquecimento.next('demorando');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'O sistema está demorando mais que o esperado para iniciar. Você já pode tentar entrar.',
    );
    expect(component.form.enabled).toBe(true);
    expect(component.form.getRawValue()).toEqual({ ds_usuario: 'admin', ds_senha: '123' });
    expect(fixture.nativeElement.querySelector('button[type="submit"]')?.disabled).toBe(false);
  });

  it('encerra a observação do estado quando o componente é destruído', () => {
    expect(estadosAquecimento.observed).toBe(true);

    fixture.destroy();

    expect(estadosAquecimento.observed).toBe(false);
  });
});
