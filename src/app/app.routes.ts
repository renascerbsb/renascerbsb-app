import { Routes } from '@angular/router';
import { Pessoas } from './pages/pessoas/pessoas';
import { Kids } from './pages/kids/kids';
import { Visitantes } from './pages/visitantes/visitantes';
import { Inicio } from './pages/inicio/inicio'
import { PessoaForm } from './pages/pessoas/form/pessoa-form/pessoa-form';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'pessoas/novo', component: PessoaForm },
  { path: 'pessoas/:id/editar', component: PessoaForm },  
  { path: 'pessoas', component: Pessoas },
  { path: 'pessoas/novo', component: PessoaForm },
  { path: 'pessoas/:id/editar', component: PessoaForm },
  { path: 'kids', component: Kids },
  { path: 'visitantes', component: Visitantes }
];