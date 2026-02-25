import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { OlympicData } from 'src/app/models/olympicModel';
import * as e from 'express';

@Injectable({
  providedIn: 'root'
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympicsSubject = new BehaviorSubject<OlympicData[]| null>(null);
  olympics$ = this.olympicsSubject.asObservable();
  constructor(private http: HttpClient) {}

 loadInitialData(): Observable<OlympicData[]> {
    return this.http.get<OlympicData[]>(this.olympicUrl).pipe(
      tap(data => this.olympicsSubject.next(data)),
      catchError(error => {
        console.error('Error loading olympic data', error);
        this.olympicsSubject.next(null);
        return throwError(() => error);
      })
    );
  }

}