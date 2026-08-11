import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  isLight = false;
  menuMobileAberto = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
      this.setLightTheme();
      this.isLight = true;
    }
  }

  toggleTheme() {
    this.isLight = !this.isLight;

    if (this.isLight) {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
  }

  toggleMenuMobile(): void {
    this.menuMobileAberto = !this.menuMobileAberto;
  }

  fecharMenuMobile(): void {
    this.menuMobileAberto = false;
  }

  confirmarLogout(): void {
    this.confirmationService.confirm({
      header: 'Sair do sistema?',
      message: 'Você precisará informar novamente seu usuário e senha para acessar o sistema.',
      icon: 'pi pi-sign-out',
      acceptLabel: 'Sair',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.logout(),
      reject: () => undefined,
    });
  }

  setLightTheme() {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }

  setDarkTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }

  private logout(): void {
    this.fecharMenuMobile();
    this.authService.logout();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
