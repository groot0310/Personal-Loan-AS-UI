import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

import { DecisionModal } from '../../shared/modals/decision-modal/decision-modal';
import { mapStatusToStage } from '../../core/utils/application-status-mapper';

import { ApplicationInitStatus } from '../../core/models/application-init-status.model';
import { UIApplicationStage } from '../../core/models/ui-application-stage.model';
import { BehaviorSubject, catchError, combineLatest, of, switchMap, tap } from 'rxjs';

/* ================= INTERFACES ================= */

interface LoanApplication {
  applicationId: string;
  loanType: string;
  requestedAmount: number;
  tenureMonths: number;

  personal: {
    fullName: string;
    email: string;
    mobileNumber: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    employmentType: string;
    monthlyIncome: number;
    companyName?: string;
    panNumber?: string;
    aadhaarNumber?: string;
    bankAccount?: string;
    ifscCode?: string;
  };

  documents: {
    name: string;
    file: string;
    type: string;
  }[];
  status: ApplicationInitStatus;
}

@Component({
  standalone: true,
  selector: 'app-application-details',
  imports: [CommonModule, FormsModule, MatCardModule, DecisionModal],
  templateUrl: './application-details.html',
})
export class ApplicationDetails implements OnInit {
  /* ================= ROUTE ================= */
  applicationId!: string;

  /* ================= UI STATE ================= */
  loading$ = new BehaviorSubject<boolean>(true);
  errorMessage = '';

  /* ================= MODAL ================= */
  showModal = false;
  action: 'APPROVE' | 'REJECT' | null = null;

  /* ================= STATUS ================= */
  currentStatus!: ApplicationInitStatus;
  currentStage!: UIApplicationStage;

  /* ================= UI STAGES ================= */
  uiStages: { key: UIApplicationStage; label: string }[] = [
    { key: 'CREATED', label: 'Created' },
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'DOCUMENT_VERIFICATION', label: 'Document Verification' },
    { key: 'LOAN_APPROVAL', label: 'Loan Approval' },
    { key: 'DISBURSED', label: 'Disbursed' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  /* ================= DATA ================= */
  loanApplication?: LoanApplication;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  /* ================= LIFECYCLE ================= */
  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('id')!;
    this.loadLoanApplication();
  }

  loadLoanApplication(): void {
    this.loading$.next(true);

    this.http
      .get<any>(`http://localhost:8080/api/loan-applications/${this.applicationId}`)
      .pipe(
        tap((application) => {
          console.log('Fetched application:', application);

          this.loanApplication = application;
          this.currentStatus = application.applicationStatus;
          this.currentStage = mapStatusToStage(this.currentStatus);
        }),

        switchMap((application) =>
          this.http.get<any>(`http://localhost:8080/api/user/viewProfile/${application.user.id}`)
        ),

        tap((profile) => {
          console.log('Fetched user profile:', profile);
          this.loanApplication!.personal = profile;
        }),

        catchError((error) => {
          console.error('Error loading data', error);
          this.errorMessage = 'Failed to load application details';
          return of(null);
        })
      )
      .subscribe({
        complete: () => {
          this.loading$.next(false);
        },
      });
  }
  /* ================= MODAL ACTIONS ================= */
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

  /* ================= TIMELINE ================= */
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

  /* ================= BUTTON LOGIC ================= */
  get canApprove(): boolean {
    return this.currentStatus === 'DOCUMENT_VERIFICATION_PENDING';
  }

  get canReject(): boolean {
    return this.currentStatus === 'DOCUMENT_VERIFICATION_PENDING';
  }
}
