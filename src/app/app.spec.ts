import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        ConfirmationService,
        MessageService,
        {
          provide: AuthService,
          useValue: { estaAutenticado: vi.fn(() => true), logout: vi.fn() },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the application brand', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand')?.textContent).toContain('Renascer');
  });

  it('should hide the authenticated layout before the session is confirmed', () => {
    vi.spyOn(TestBed.inject(AuthService), 'estaAutenticado').mockReturnValue(false);
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-navbar')).toBeNull();
    expect(fixture.nativeElement.querySelector('main.app-main')).toBeNull();
  });
});
