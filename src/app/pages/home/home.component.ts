import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
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
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.olympicService.getOlympicData().subscribe({
      next: (data: OlympicData[]) => {
        console.log(`Liste des données : ${JSON.stringify(data)}`);
        if (data && data.length > 0) {
          // Extraction des années uniques
          const allYears = data.flatMap((item: OlympicData) => 
            item.participations.map((participation) => participation.year)
          );
          this.totalJOs = Array.from(new Set(allYears)).length;

          // Extraction des pays
          const countries: string[] = data.map((item: OlympicData) => item.country);
          this.totalCountries = countries.length;

          // Calcul du total des médailles par pays
          const sumOfAllMedalsYears: number[] = data.map((item: OlympicData) => 
            item.participations.reduce((acc: number, participation) => 
              acc + participation.medalsCount, 0
            )
          );

          this.buildPieChart(countries, sumOfAllMedalsYears);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(`erreur : ${error}`);
        this.error = error.message;
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
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: this.isMobile() ? 'bottom' : 'right',
            labels: {
              padding: this.isMobile() ? 10 : 15,
              font: {
                size: this.isMobile() ? 10 : 12
              }
            }
          }
        },
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
              const countryName = pieChart.data.labels ? pieChart.data.labels[firstPoint.index] : '';
              this.router.navigate(['country', countryName]);
            }
          }
        }
      }
    });
    
    this.pieChart = pieChart;
  }
}
