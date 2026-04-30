import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio implements AfterViewInit {
  @ViewChild('bairroChart') bairroChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('perfilChart') perfilChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cultoChart') cultoChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('visitantesMesChart') visitantesMesChart!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    Chart.defaults.color = '#e5e7eb';
    Chart.defaults.borderColor = '#475569';

    this.criarGraficos();
  }

  criarGraficos(): void {
    new Chart(this.bairroChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Paranoá', 'Gama', 'Santa Maria', 'Asa Sul', 'Luziânia'],
        datasets: [{
          data: [72, 44, 31, 18, 25],
          backgroundColor: ['#2563eb', '#38bdf8', '#7dd3fc', '#93c5fd', '#1e40af'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });

    new Chart(this.perfilChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Membros', 'Visitantes', 'Liderança', 'Kids'],
        datasets: [{
          label: 'Quantidade',
          data: [176, 38, 21, 7],
          backgroundColor: '#38bdf8',
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    new Chart(this.cultoChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Dom 10h', 'Dom 18h', 'Quarta', 'Eventos'],
        datasets: [{
          label: 'Visitantes',
          data: [9, 6, 2, 2],
          backgroundColor: '#60a5fa',
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true } }
      }
    });

    new Chart(this.visitantesMesChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Visitantes',
          data: [8, 11, 14, 10, 17, 19],
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, .16)',
          fill: true,
          tension: .35,
          pointRadius: 5,
          pointBackgroundColor: '#7dd3fc'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}