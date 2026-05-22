import { Routes } from '@angular/router';
import { Pessoas } from './pages/pessoas/pessoas';
import { Kids } from './pages/kids/kids';
import { Visitantes } from './pages/visitantes/visitantes';
import { Inicio } from './pages/inicio/inicio';
import { Eventos } from './pages/eventos/eventos';
import { PessoaForm } from './pages/pessoas/form/pessoa-form/pessoa-form';
import { EventoForm } from './pages/eventos/form/evento-form/evento-form';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'eventos/novo', component: EventoForm },
  { path: 'eventos/:id/editar', component: EventoForm },
  { path: 'eventos', component: Eventos },
  { path: 'pessoas/novo', component: PessoaForm },
  { path: 'pessoas/:id/detalhar', component: PessoaForm },
  { path: 'pessoas/:id/editar', component: PessoaForm },
  { path: 'pessoas', component: Pessoas },
  { path: 'kids', component: Kids },
  { path: 'visitantes', component: Visitantes }
];
