import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { catchError, map, Observable, of, shareReplay, take, tap, throwError, timeout } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-loan-officer-applications',
  imports: [CommonModule, RouterModule],
  templateUrl: './applications.html',
})
export class Applications {
  private readonly API = 'http://localhost:8080/api/loan-applications';

  readonly applications$: Observable<any[]>;

  constructor(private http: HttpClient) {
    this.applications$ = this.http.get<{ content: any[] }>(this.API).pipe(
      tap((res) => console.log('Fetched applications:', res)), // ✅ logging only
      map((res) => res.content), // ✅ extract array
      shareReplay({ bufferSize: 1, refCount: true }),
      catchError((err) => {
        console.error('API error', err);
        return throwError(() => err);
      })
    );
  }
}
