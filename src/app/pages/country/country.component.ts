import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import Chart from 'chart.js/auto';
import { OlympicData, Participation } from 'src/app/models/olympicModel';
import { OlympicService } from 'src/app/services/OlympicService';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  public lineChart!: Chart<"line", number[], number>;
  public titlePage: string = '';
  public totalEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public error!: string;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param: ParamMap) => {
      const countryName = param.get('countryName');
      if (countryName) {
        this.loadCountryData(countryName);
      }
    });
  }

  private loadCountryData(countryName: string): void {
    this.olympicService.getOlympicData().subscribe({
      next: (data: OlympicData[]) => {
        if (data && data.length > 0) {
          const selectedCountry = data.find((item: OlympicData) => item.country === countryName);
          
          if (!selectedCountry) {
            this.error = 'Pays non trouvé';
            return;
          }

          this.titlePage = selectedCountry.country;
          const participations = selectedCountry.participations;
          this.totalEntries = participations.length;

          const years: number[] = participations.map((participation: Participation) => participation.year);
          const medals: number[] = participations.map((participation: Participation) => participation.medalsCount);
          
          this.totalMedals = medals.reduce((accumulator: number, count: number) => accumulator + count, 0);
          
          const athleteCounts: number[] = participations.map((participation: Participation) => participation.athleteCount);
          this.totalAthletes = athleteCounts.reduce((accumulator: number, count: number) => accumulator + count, 0);
          
          this.buildChart(years, medals);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message;
      }
    });
  }

  private buildChart(years: number[], medals: number[]): void {
    const lineChart = new Chart("countryChart", {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: "medals",
            data: medals,
            backgroundColor: '#0b868f'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
    this.lineChart = lineChart;
  }
}