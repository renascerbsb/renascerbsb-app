import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Pessoa, PessoaService } from '../../services/pessoa.service'

@Component({
  selector: 'app-pessoas',
  standalone: true,
  templateUrl: './pessoas.html',
  styleUrl: './pessoas.scss',
  imports: [RouterLink],
})
export class Pessoas implements OnInit {

  pessoas: Pessoa[] = [];

  constructor(
    private pessoaService: PessoaService
  ) {}

  ngOnInit(): void {

    this.pessoaService.listar().subscribe({

      next: (dados) => {
        this.pessoas = dados;
      },

      error: (erro) => {
        console.error('Erro ao buscar pessoas', erro);
      }

    });
  }
}