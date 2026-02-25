import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OlympicService } from './services/OlympicService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  // ✅

})
export class AppComponent {
constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe();
  }
}
