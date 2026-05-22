import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-inicio',
  imports: [FormsModule, CardModule, SelectModule, TableModule, TagModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio implements AfterViewInit {
  @ViewChild('bairroChart') bairroChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('perfilChart') perfilChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cultoChart') cultoChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('visitantesMesChart') visitantesMesChart!: ElementRef<HTMLCanvasElement>;
  filiais = ['Luziania', 'Todas as filiais', 'Paranoa', 'Brasilia'].map(nome => ({ label: nome, value: nome }));
  periodos = ['Este mes', 'Ultimos 30 dias', 'Este ano'].map(nome => ({ label: nome, value: nome }));
  filialSelecionada = 'Luziania';
  periodoSelecionado = 'Este mes';
  visitantesPendentes = [
    { nome: 'Marina Alves', culto: 'Domingo - 10h', convidadoPor: 'Luana', telefone: '(61) 99999-0000', status: 'Aguardando contato' },
    { nome: 'Joao Pedro', culto: 'Domingo - 18h', convidadoPor: 'Espontaneo', telefone: '(61) 98888-0000', status: 'Primeiro retorno' },
    { nome: 'Renata Lima', culto: 'Quarta - 20h', convidadoPor: 'Jose', telefone: '(61) 97777-0000', status: 'Deseja celula' }
  ];

  ngAfterViewInit(): void {
    const styles = getComputedStyle(document.documentElement);
    Chart.defaults.color = styles.getPropertyValue('--text-muted').trim();
    Chart.defaults.borderColor = styles.getPropertyValue('--surface-border').trim();

    this.criarGraficos();
  }

  criarGraficos(): void {
    new Chart(this.bairroChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Paranoa', 'Gama', 'Santa Maria', 'Asa Sul', 'Luziania'],
        datasets: [{
          data: [72, 44, 31, 18, 25],
          backgroundColor: ['#B34D0C', '#fb923c', '#fdba74', '#fed7aa', '#7c2d12'],
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
        labels: ['Membros', 'Visitantes', 'Lideranca', 'Kids'],
        datasets: [{
          label: 'Quantidade',
          data: [176, 38, 21, 7],
          backgroundColor: '#B34D0C',
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
          backgroundColor: '#fb923c',
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
          borderColor: '#B34D0C',
          backgroundColor: 'rgba(179, 77, 12, .16)',
          fill: true,
          tension: .35,
          pointRadius: 5,
          pointBackgroundColor: '#fb923c'
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
