import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ConfirmDialogModule, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(
    public router: Router,
    private readonly authService: AuthService,
  ) {}

  get isLoginPage(): boolean {
    return this.router.url.startsWith('/login');
  }

  get exibirLayoutAutenticado(): boolean {
    return !this.isLoginPage && this.authService.estaAutenticado();
  }
}
