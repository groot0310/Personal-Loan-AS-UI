import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { ApplicationInitStatus } from '../../core/models/application-init-status.model';
import { mapStatusToStage } from '../../core/utils/application-status-mapper';
import { UIApplicationStage } from '../../core/models/ui-application-stage.model';
import { ApplicationTimeline } from '../../shared/components/application-timeline/application-timeline';
import { HeaderComponent } from '../../shared/header/header';

@Component({
  standalone: true,
  selector: 'app-user-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    ApplicationTimeline,
    HeaderComponent,
    MatSnackBarModule,
    HttpClientModule, // ✅ IMPORTANT
  ],
  templateUrl: './user-dashboard.html',
  styleUrl: './dashboard.css',
})
export class UserDashboard {
  currentStatus: ApplicationInitStatus = 'DOCUMENT_VERIFICATION_PENDING';
  currentStage: UIApplicationStage = mapStatusToStage(this.currentStatus);

  checkingApply = false;

  private readonly API = 'http://localhost:8080/api/loan-applications';

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  /* ================= STATUS UI ================= */

  get currentStatusLabel(): string {
    switch (this.currentStatus) {
      case 'DOCUMENT_VERIFICATION_PENDING':
        return 'Document Verification in Progress';
      case 'LOAN_APPROVED':
        return 'Loan Approved';
      case 'LOAN_DISBURSED':
        return 'Loan Disbursed';
      default:
        return 'Application Submitted';
    }
  }

  get statusDescription(): string {
    switch (this.currentStatus) {
      case 'DOCUMENT_VERIFICATION_PENDING':
        return 'We are reviewing your uploaded documents. You’ll be notified if any action is required.';
      case 'LOAN_APPROVED':
        return 'Your loan has been approved. Please review and accept the sanction letter.';
      case 'LOAN_DISBURSED':
        return 'The loan amount has been successfully credited to your account.';
      default:
        return 'Your application has been received and is under initial review.';
    }
  }

  get primaryActionLabel(): string | null {
    if (this.currentStatus === 'DOCUMENT_VERIFICATION_PENDING') {
      return 'Upload Documents';
    }
    if (this.currentStatus === 'LOAN_APPROVED') {
      return 'Accept Sanction';
    }
    return null;
  }

  get primaryActionRoute(): any[] {
    if (this.currentStatus === 'DOCUMENT_VERIFICATION_PENDING') {
      return ['/user/upload-documents', 'PL-1023'];
    }
    if (this.currentStatus === 'LOAN_APPROVED') {
      return ['/user/loan-details', 'PL-1023'];
    }
    return [];
  }

  /* ================= APPLY LOAN GATE ================= */
  applyLoan(): void {
    if (this.checkingApply) return;

    this.checkingApply = true;

    const token = localStorage.getItem('token');

    this.http
      .get<{ canApply: boolean; reason?: string }>(`${this.API}/can-apply`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe({
        next: (res) => {
          this.checkingApply = false;

          if (res.canApply) {
            // Allowed → go to form
            this.router.navigate(['/shared/loan-stepper2']);
          } else {
            // ❌ Existing user but blocked
            this.snackBar.open(res.reason || 'You cannot apply for a loan right now', 'OK', {
              duration: 6000,
              verticalPosition: 'top',
            });
          }
        },

        error: (err) => {
          this.checkingApply = false;

          console.warn('Can-Apply check failed (assuming new user):', err);
          this.router.navigate(['/shared/loan-stepper2']);
        },
      });
  }
}
