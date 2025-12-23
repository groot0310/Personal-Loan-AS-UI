import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DecisionModal } from '../../shared/modals/decision-modal/decision-modal';
import { mapStatusToStage } from '../../core/utils/application-status-mapper';

import { ApplicationInitStatus } from '../../core/models/application-init-status.model';
import { UIApplicationStage } from '../../core/models/ui-application-stage.model';

@Component({
  standalone: true,
  selector: 'app-application-details',
  imports: [CommonModule, DecisionModal],
  templateUrl: './application-details.html',
})
export class ApplicationDetails {
  applicationId = '';

  // modal state
  showModal = false;
  action: 'APPROVE' | 'REJECT' | null = null;

  // backend status (later comes from API)
  currentStatus: ApplicationInitStatus = 'DOCUMENT_VERIFICATION_PENDING';

  // UI stage (derived)
  currentStage!: UIApplicationStage;

  // UI timeline stages
  uiStages: { key: UIApplicationStage; label: string }[] = [
    { key: 'CREATED', label: 'Created' },
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'DOCUMENT_VERIFICATION', label: 'Document Verification' },
    { key: 'LOAN_APPROVAL', label: 'Loan Approval' },
    { key: 'DISBURSED', label: 'Disbursed' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  // documents (UI only for now)
  documents = [
    { name: 'PAN Card', file: 'pan.pdf' },
    { name: 'Salary Slip', file: 'salary-slip.pdf' },
    { name: 'Bank Statement', file: 'bank-statement.pdf' },
  ];

  constructor(private route: ActivatedRoute) {
    this.applicationId = this.route.snapshot.paramMap.get('id')!;
    this.currentStage = mapStatusToStage(this.currentStatus);
  }

  // modal actions
  openModal(action: 'APPROVE' | 'REJECT') {
    this.action = action;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.action = null;
  }

  confirmDecision() {
    console.log(`Application ${this.applicationId} ${this.action}`);
    this.closeModal();
  }

  // timeline helper
  isStageCompleted(stage: UIApplicationStage): boolean {
    const order: UIApplicationStage[] = [
      'CREATED',
      'SUBMITTED',
      'DOCUMENT_VERIFICATION',
      'LOAN_APPROVAL',
      'DISBURSED',
      'CLOSED',
    ];

    return order.indexOf(stage) <= order.indexOf(this.currentStage);
  }

  get canApprove(): boolean {
    return this.currentStatus === 'DOCUMENT_APPROVED';
  }

  get canReject(): boolean {
    return this.currentStatus === 'DOCUMENT_VERIFICATION_PENDING';
  }
}
