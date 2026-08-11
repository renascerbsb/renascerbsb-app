import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Confirmation, ConfirmationService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authService: { logout: ReturnType<typeof vi.fn> };
  let confirmationService: { confirm: ReturnType<typeof vi.fn> };
  let router: Router;
  let confirmacao: Confirmation | undefined;

  beforeEach(async () => {
    authService = { logout: vi.fn() };
    confirmationService = {
      confirm: vi.fn((opcao: Confirmation) => {
        confirmacao = opcao;
        return confirmationService;
      }),
    };

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: ConfirmationService, useValue: confirmationService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('theme'));

  it('exibe a opção Sair separada no rodapé do menu', () => {
    const rodape = fixture.nativeElement.querySelector('.sidebar-footer');
    const botaoSair = rodape.querySelector('.logout-button');

    expect(botaoSair.textContent).toContain('Sair');
    expect(botaoSair.querySelector('.pi-sign-out')).toBeTruthy();
  });

  it('abre a confirmação com os textos esperados', () => {
    fixture.nativeElement.querySelector('.logout-button').click();

    expect(confirmationService.confirm).toHaveBeenCalledTimes(1);
    expect(confirmacao).toMatchObject({
      header: 'Sair do sistema?',
      message: 'Você precisará informar novamente seu usuário e senha para acessar o sistema.',
      acceptLabel: 'Sair',
      rejectLabel: 'Cancelar',
    });
  });

  it('cancela sem encerrar a sessão', () => {
    fixture.nativeElement.querySelector('.logout-button').click();
    confirmacao?.reject?.();

    expect(authService.logout).not.toHaveBeenCalled();
  });

  it('encerra a sessão e substitui a rota atual por /login ao confirmar', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture.nativeElement.querySelector('.logout-button').click();
    confirmacao?.accept?.();

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/login', { replaceUrl: true });
  });

  it('abre e fecha o menu mobile, inclusive ao confirmar o logout', () => {
    fixture.nativeElement.querySelector('.menu-toggle').click();
    fixture.detectChanges();

    expect(component.menuMobileAberto).toBe(true);
    expect(fixture.nativeElement.querySelector('.app-sidebar').classList).toContain('mobile-open');

    fixture.nativeElement.querySelector('.logout-button').click();
    confirmacao?.accept?.();
    fixture.detectChanges();

    expect(component.menuMobileAberto).toBe(false);
    expect(fixture.nativeElement.querySelector('.app-sidebar').classList).not.toContain(
      'mobile-open',
    );
  });
});
