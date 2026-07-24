import { Routes } from '@angular/router';
import { Pessoas } from './pages/pessoas/pessoas';
import { Kids } from './pages/kids/kids';
import { Visitantes } from './pages/visitantes/visitantes';
import { Inicio } from './pages/inicio/inicio';
import { Eventos } from './pages/eventos/eventos';
import { PessoaForm } from './pages/pessoas/form/pessoa-form/pessoa-form';
import { EventoForm } from './pages/eventos/form/evento-form/evento-form';
import { Login } from './pages/login/login';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'inicio', component: Inicio, canActivate: [authGuard] },
  { path: 'eventos/novo', component: EventoForm, canActivate: [authGuard] },
  { path: 'eventos/:id/editar', component: EventoForm, canActivate: [authGuard] },
  { path: 'eventos', component: Eventos, canActivate: [authGuard] },
  { path: 'pessoas/novo', component: PessoaForm, canActivate: [authGuard] },
  { path: 'pessoas/:id/detalhar', component: PessoaForm, canActivate: [authGuard] },
  { path: 'pessoas/:id/editar', component: PessoaForm, canActivate: [authGuard] },
  { path: 'pessoas', component: Pessoas, canActivate: [authGuard] },
  { path: 'kids', component: Kids, canActivate: [authGuard] },
  { path: 'visitantes', component: Visitantes, canActivate: [authGuard] },
  {
    path: 'jornada',
    loadComponent: () => import('./pages/jornada/jornada').then((modulo) => modulo.Jornada),
    canActivate: [authGuard],
  },
  {
    path: 'trajetorias',
    loadComponent: () =>
      import('./pages/trajetorias/trajetorias').then((modulo) => modulo.Trajetorias),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'inicio' },
];
