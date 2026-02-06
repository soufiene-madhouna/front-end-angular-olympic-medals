import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { ChartEvent } from 'chart.js';
import { OlympicData, Participation } from '../../models/olympicModel';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
private olympicUrl = './assets/mock/olympic.json';
  public pieChart!: Chart<"pie", number[], string>;
  public totalCountries: number = 0;
  public totalJOs: number = 0;
  public error!: string;
  titlePage: string = "Medals per Country";

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<OlympicData[]>(this.olympicUrl).subscribe({
      next: (data: OlympicData[]) => {
        console.log(`Liste des données : ${JSON.stringify(data)}`);
        if (data && data.length > 0) {
          // Extraction des années uniques
          const allYears = data.flatMap((item: OlympicData) => 
            item.participations.map((participation: Participation) => participation.year)
          );
          this.totalJOs = Array.from(new Set(allYears)).length;

          // Extraction des pays
          const countries: string[] = data.map((item: OlympicData) => item.country);
          this.totalCountries = countries.length;

          // Calcul du total des médailles par pays
          const sumOfAllMedalsYears: number[] = data.map((item: OlympicData) => 
            item.participations.reduce((acc: number, participation: Participation) => 
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

  buildPieChart(countries: string[], sumOfAllMedalsYears: number[]): void {
    const pieChart = new Chart("DashboardPieChart", {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals',
          data: sumOfAllMedalsYears,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
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

