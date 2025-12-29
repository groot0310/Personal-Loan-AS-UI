import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  catchError,
  map,
  Observable,
  shareReplay,
  tap,
  throwError,
  BehaviorSubject,
  combineLatest,
} from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-loan-officer-applications',
  imports: [CommonModule, RouterModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './applications.html',
})
export class Applications implements OnInit {
  private readonly API = 'http://localhost:8080/api/loan-applications';

  /* ================= EXISTING CODE (UNCHANGED) ================= */
  readonly applications$: Observable<any[]>;

  constructor(private http: HttpClient) {
    this.applications$ = this.http.get<{ content: any[] }>(this.API).pipe(
      tap((res) => console.log('Fetched applications:', res)),
      map((res) => res.content),
      shareReplay({ bufferSize: 1, refCount: true }),
      catchError((err) => {
        console.error('API error', err);
        return throwError(() => err);
      })
    );
  }

  /* ================= PAGINATION ================= */
  pageSize = 5;
  totalItems = 0;

  private pageIndex$ = new BehaviorSubject<number>(0);
  paginatedApplications$!: Observable<any[]>;

  ngOnInit(): void {
    this.paginatedApplications$ = combineLatest([this.applications$, this.pageIndex$]).pipe(
      map(([apps, pageIndex]) => {
        this.totalItems = apps.length;

        const start = pageIndex * this.pageSize;
        const end = start + this.pageSize;

        return apps.slice(start, end);
      })
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex$.next(event.pageIndex);
  }
}
