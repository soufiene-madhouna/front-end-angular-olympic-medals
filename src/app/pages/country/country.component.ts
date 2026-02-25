import { CommonModule } from '@angular/common';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router, RouterLink} from '@angular/router';
import Chart from 'chart.js/auto';
import { OlympicData, Participation } from 'src/app/models/olympicModel';
import { OlympicService } from 'src/app/services/OlympicService';


@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule,RouterLink],
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
    private olympicService: OlympicService,
    private cdr: ChangeDetectorRef  // ✅ nécessaire avec OnPush
    
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
  this.olympicService.olympics$.subscribe({
    next: (data: OlympicData[] | null) => {  // ✅ accepter null
      
      // ✅ Guard clause si data est null (valeur initiale du BehaviorSubject)
      if (!data || data.length === 0) return;

      const selectedCountry = data.find(
        (item: OlympicData) => item.country === countryName
      );

      // ✅ Redirection si pays non trouvé
      if (!selectedCountry) {
        this.error = 'Pays non trouvé';
        this.cdr.markForCheck();
        this.router.navigate(['/']);  // ✅ retour à l'accueil
        return;
      }

      this.titlePage = selectedCountry.country;
      const participations = selectedCountry.participations;
      this.totalEntries = participations.length;

      const years: number[] = participations.map(
        (p: Participation) => p.year
      );
      const medals: number[] = participations.map(
        (p: Participation) => p.medalsCount
      );

      this.totalMedals = medals.reduce(
        (acc: number, count: number) => acc + count, 0
      );

      const athleteCounts: number[] = participations.map(
        (p: Participation) => p.athleteCount
      );
      this.totalAthletes = athleteCounts.reduce(
        (acc: number, count: number) => acc + count, 0
      );

      // ✅ Détruire l'ancien chart avant d'en créer un nouveau
      if (this.lineChart) {
        this.lineChart.destroy();
        this.lineChart = null!;
      }

      setTimeout(() => {
        this.buildChart(years, medals);
        this.cdr.markForCheck();  // ✅ notifier Angular avec OnPush
      }, 0);
    },
    error: (error: HttpErrorResponse) => {
      this.error = error.message;
      this.cdr.markForCheck();  // ✅
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