import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { ChartEvent } from 'chart.js';
import { OlympicData, Participation } from '../../models/olympicModel';
import { OlympicService } from 'src/app/services/OlympicService';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public pieChart!: Chart<"pie", number[], string>;
  public totalCountries: number = 0;
  public totalJOs: number = 0;
  public error!: string;
  titlePage: string = "Medals per Country";

  constructor(
    private router: Router, 
    private olympicService: OlympicService,
    private cdr: ChangeDetectorRef  // ✅ nécessaire avec OnPush

  ) {}

  ngOnInit(): void {
   this.Olympic()
  }

   Olympic(): void {
    // ✅ On s'abonne à olympics$ au lieu d'appeler getOlympicData()
    this.olympicService.olympics$.subscribe({
      next: (data: OlympicData[] | null) => {
        // ✅ On vérifie que data n'est pas null (valeur initiale du BehaviorSubject)
        if (data && data.length > 0) {
          const allYears = data.flatMap((item: OlympicData) =>
            item.participations.map((participation) => participation.year)
          );
          this.totalJOs = Array.from(new Set(allYears)).length;

          const countries: string[] = data.map((item: OlympicData) => item.country);
          this.totalCountries = countries.length;

          const sumOfAllMedalsYears: number[] = data.map((item: OlympicData) =>
            item.participations.reduce((acc: number, participation) =>
              acc + participation.medalsCount, 0
            )
          );

          // ✅ On détruit l'ancien chart avant d'en créer un nouveau
          if (this.pieChart) {
            this.pieChart.destroy();
          }

          this.buildPieChart(countries, sumOfAllMedalsYears);
          this.cdr.markForCheck();  // ✅ demande à Angular de re-vérifier le composant

        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(`erreur : ${error}`);
        this.error = error.message
        this.cdr.markForCheck();  // ✅ idem en cas d'erreur

      }
    });
  }
 private isMobile(): boolean {
    return window.innerWidth < 768;
  }
 /**
   * Génère des couleurs distinctes de manière déterministe
   * Utilise l'index pour générer une couleur stable
   */
  generateStableColors(count: number): string[] {
    const colors: string[] = [];
    const goldenRatioConjugate = 0.618033988749895;
    let hue = 0.5; // Valeur fixe au lieu de Math.random()

    for (let i = 0; i < count; i++) {
      hue += goldenRatioConjugate;
      hue %= 1;
      
      const saturation = 65 + (i % 3) * 5;
      const lightness = 50 + (i % 2) * 10;
      
      colors.push(`hsl(${Math.floor(hue * 360)}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
  }

 private buildPieChart(countries: string[], sumOfAllMedalsYears: number[]): void {
  const colors = this.generateStableColors(countries.length);

  const getResponsiveOptions = () => {
    const width = window.innerWidth;
    if (width <= 480) {
      return { aspectRatio: 1, fontSize: 11, padding: 10, boxWidth: 30 };
    } else if (width <= 768) {
      return { aspectRatio: 1.5, fontSize: 12, padding: 12, boxWidth: 35 };
    } else {
      return { aspectRatio: 2.5, fontSize: 12, padding: 15, boxWidth: 40 };
    }
  };

  const options = getResponsiveOptions();

  const pieChart = new Chart("DashboardPieChart", {
    type: 'pie',
    data: {
      labels: countries,
      datasets: [{
        label: 'Medals',
        data: sumOfAllMedalsYears,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: this.isMobile() ? 5 : 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: options.aspectRatio,
      // ✅ onClick au bon niveau (pas dans plugins)
      onClick: (event: ChartEvent) => {
        if (event.native) {
          const points = pieChart.getElementsAtEventForMode(
            event.native,
            'point',
            { intersect: true },
            true
          );

          if (points.length) {
            const firstPoint = points[0];
            const countryName = pieChart.data.labels
              ? pieChart.data.labels[firstPoint.index]
              : '';
            this.router.navigate(['country', countryName]);
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            padding: options.padding,
            font: { size: options.fontSize },
            boxWidth: options.boxWidth
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value} medals`;
            }
          }
        }
      }
    }
  });

  this.pieChart = pieChart;

  // ✅ Mise à jour du chart au resize de la fenêtre
  window.addEventListener('resize', () => {
    const newOptions = getResponsiveOptions();
    if (this.pieChart) {
      this.pieChart.options.aspectRatio = newOptions.aspectRatio;
      this.pieChart.update();
    }
  });
}   
}