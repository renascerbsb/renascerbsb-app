import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-kids',
  imports: [ButtonModule, CardModule, TableModule, TagModule],
  templateUrl: './kids.html',
  styleUrl: './kids.scss',
})
export class Kids {
  criancas = [
    { nome: 'Ana Clara', responsavel: 'Marina Alves', idade: 7, status: 'Autorizada' },
    { nome: 'Pedro Lucas', responsavel: 'Joao Pedro', idade: 5, status: 'Pendente' }
  ];
}
