import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-inicio',
  imports: [FormsModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {

}
