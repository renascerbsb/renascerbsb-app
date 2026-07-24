import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TelaTrajetoria } from './trajetorias.types';

@Component({
  selector: 'app-trajetorias-menu',
  templateUrl: './trajetorias-menu.html',
})
export class TrajetoriasMenu {
  @Input({ required: true }) tela!: TelaTrajetoria;
  @Input() possuiTrajetoriaSelecionada = false;

  @Output() navegar = new EventEmitter<TelaTrajetoria>();
}
