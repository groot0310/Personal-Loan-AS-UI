import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
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

  /* ================= INPUTS (🔥 REQUIRED FOR REUSE) ================= */

  @Input() applications: any[] | null = null; // used by ADMIN
  @Input() isAdminView = false; // role-based UI switch

  /* ================= LOAN OFFICER FLOW ================= */

  readonly applications$?: Observable<any[]>;

  constructor(private http: HttpClient) {
    // Loan Officer fetches data himself
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
    // 🔥 ADMIN → use passed data
    if (this.isAdminView && this.applications) {
      this.paginatedApplications$ = combineLatest([this.pageIndex$]).pipe(
        map(() => {
          this.totalItems = this.applications!.length;
          const start = this.pageIndex$.value * this.pageSize;
          const end = start + this.pageSize;
          return this.applications!.slice(start, end);
        })
      );
      return;
    }

    // 🔥 LOAN OFFICER → use API stream
    this.paginatedApplications$ = combineLatest([this.applications$!, this.pageIndex$]).pipe(
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

  getReviewLink(app: any): any[] {
    if (this.isAdminView) {
      return ['/admin/application', app.applicationId];
    }
    return ['/loan-officer/application', app.applicationId];
  }
}
