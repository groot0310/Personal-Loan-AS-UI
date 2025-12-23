import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApplicationInitStatus } from '../../core/models/application-init-status.model';
import { mapStatusToStage } from '../../core/utils/application-status-mapper';
import { UIApplicationStage } from '../../core/models/ui-application-stage.model';
import { ApplicationTimeline } from '../../shared/components/application-timeline/application-timeline';

@Component({
  standalone: true,
  selector: 'app-user-dashboard',
  imports: [CommonModule, RouterModule, ApplicationTimeline],
  templateUrl: './dashboard.html',
})
export class UserDashboard {
  currentStatus: ApplicationInitStatus = 'DOCUMENT_VERIFICATION_PENDING';
  currentStage: UIApplicationStage = mapStatusToStage(this.currentStatus);

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
}
