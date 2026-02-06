import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OlympicData } from 'src/app/models/olympicModel';

@Injectable({
  providedIn: 'root'
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

  constructor(private http: HttpClient) {}

  getOlympicData(): Observable<OlympicData[]> {
    return this.http.get<OlympicData[]>(this.olympicUrl);
  }
}