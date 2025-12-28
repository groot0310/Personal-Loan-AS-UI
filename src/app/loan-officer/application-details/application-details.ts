import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DecisionModal } from '../../shared/modals/decision-modal/decision-modal';
import { mapStatusToStage } from '../../core/utils/application-status-mapper';

import { ApplicationInitStatus } from '../../core/models/application-init-status.model';
import { UIApplicationStage } from '../../core/models/ui-application-stage.model';

interface ApplicantData {
  loanType?: string;
  requestedAmount?: number;
  tenureMonths?: number;
  personalDetails?: {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    gender?: string;
    city?: string;
    address?: string;
    state?: string;
    pincode?: string;
  };
  employmentDetails?: {
    employmentType?: string;
    monthlyIncome?: number;
    companyName?: string;
    panNumber?: string;
    aadhaarNumber?: string;
    bankAccount?: string;
    ifscCode?: string;
  };
}

@Component({
  standalone: true,
  selector: 'app-application-details',
  imports: [CommonModule, DecisionModal],
  templateUrl: './application-details.html',
})
export class ApplicationDetails implements OnInit {
  applicationId = '';
  applicantData?: ApplicantData;

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

  isLoading = true;

  constructor(private route: ActivatedRoute) {
    this.applicationId = this.route.snapshot.paramMap.get('id')!;
    this.currentStage = mapStatusToStage(this.currentStatus);
  }

  ngOnInit(): void {
    this.loadApplicationDetails();
  }

  loadApplicationDetails(): void {
    this.isLoading = true;
    // Get applicant data from route state or component state
    const navigation = this.route.snapshot.data;
    if (navigation && navigation['applicantData']) {
      this.applicantData = navigation['applicantData'];
      this.currentStatus = navigation['applicationStatus'] || this.currentStatus;
      this.currentStage = mapStatusToStage(this.currentStatus);
      this.isLoading = false;
    } else {
      this.isLoading = false;
    }
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
