import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AdminDashboard } from '../../dashboard/admin-dashboard';

@Component({
  standalone: true,
  selector: 'app-applicants',
  imports: [CommonModule, RouterModule, AdminDashboard],
  templateUrl: './applicants.html',
})
export class Applicants implements OnInit {
  private readonly API = 'http://localhost:8080/api/loan-applications';

  applications: any[] = [];
  loading = true;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;

    this.http.get<any[]>(this.API).subscribe({
      next: (data) => {
        this.applications = data.filter((app) => this.areAllDocumentsVerified(app.documents));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  /* ================= BUSINESS RULE ================= */

  private areAllDocumentsVerified(documents: any[] = []): boolean {
    const REQUIRED = ['AADHAAR', 'PAN', 'SALARY_SLIP', 'BANK_STATEMENT'];

    return REQUIRED.every((type) =>
      documents.some((d) => d.documentType === type && d.documentStatus === 'VERIFIED')
    );
  }
}
