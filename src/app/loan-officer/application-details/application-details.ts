import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';

import { mapStatusToStage } from '../../core/utils/application-status-mapper';
import { ApplicationInitStatus } from '../../core/models/application-init-status.model';
import { UIApplicationStage } from '../../core/models/ui-application-stage.model';

import { NgFor, NgIf, NgClass } from '@angular/common';

/* ================= MODELS ================= */

interface LoanApplication {
  applicationId: number;
  loanType: string;
  requestedAmount: number;
  tenureMonths: number;
  applicationStatus: ApplicationInitStatus;
  user: any;
  documents: BackendDocument[];
}

interface BackendDocument {
  documentId: number;
  documentType: string;
  documentUrl: string;
  documentStatus: 'UPLOADED' | 'VERIFIED' | 'REJECTED' | 'RETURNED_FOR_CORRECTION';
  remarks?: string;
}

interface UIDocument {
  documentId?: number;
  documentType: string;
  status: 'UPLOADED' | 'VERIFIED' | 'REJECTED' | 'RETURNED_FOR_CORRECTION' | 'NOT_UPLOADED';
  remarks?: string;
}

@Component({
  standalone: true,
  selector: 'app-application-details',
  imports: [CommonModule, FormsModule, MatCardModule, NgIf, NgFor, NgClass],
  templateUrl: './application-details.html',
  styleUrls: ['../../../styles.css'],
})
export class ApplicationDetails implements OnInit {
  applicationId!: string;

  loading$ = new BehaviorSubject<boolean>(true);
  errorMessage = '';

  loanApplication?: LoanApplication;
  documents: UIDocument[] = [];

  currentStatus!: ApplicationInitStatus;
  currentStage!: UIApplicationStage;

  // reject / return modal
  showReasonBox = false;
  reasonText = '';
  selectedDoc?: UIDocument;
  actionType: 'REJECT' | 'RETURN' | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('id')!;
    this.loadApplication();
  }

  /* ================= LOAD ================= */

  loadApplication(): void {
    this.loading$.next(true);

    this.http
      .get<LoanApplication>(`http://localhost:8080/api/loan-applications/${this.applicationId}`)
      .pipe(
        tap((res) => {
          this.loanApplication = res;
          this.currentStatus = res.applicationStatus;
          this.currentStage = mapStatusToStage(this.currentStatus);
          this.buildDocuments(res.documents || []);
        }),
        catchError((err) => {
          console.error(err);
          this.errorMessage = 'Failed to load application';
          return of(null);
        })
      )
      .subscribe(() => this.loading$.next(false));
  }

  /* ================= DOCUMENT NORMALIZER ================= */

  private buildDocuments(backendDocs: BackendDocument[]) {
    const REQUIRED = ['AADHAAR', 'PAN', 'SALARY_SLIP', 'BANK_STATEMENT'];

    this.documents = REQUIRED.map((type) => {
      const match = backendDocs.find((d) => d.documentType === type);

      return {
        documentId: match?.documentId,
        documentType: type,
        status: match?.documentStatus || 'NOT_UPLOADED',
        remarks: match?.remarks,
      };
    });
  }

  /* ================= DOWNLOAD ================= */

  viewDocument(doc: UIDocument) {
    if (!doc.documentId || doc.status === 'REJECTED') return;

    const url = `http://localhost:8080/api/documents/download/${doc.documentId}`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
        setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
      },
      error: () => alert('Unable to download document'),
    });
  }

  /* ================= VERIFY ================= */

  verifyDocument(doc: UIDocument) {
    if (!doc.documentId) return;

    this.http
      .post('http://localhost:8080/api/documents/approve', {
        documentId: doc.documentId,
        remarks: 'Verified',
      })
      .subscribe(() => (doc.status = 'VERIFIED'));
  }

  /* ================= REJECT / RETURN ================= */

  openReasonBox(doc: UIDocument, action: 'REJECT' | 'RETURN') {
    this.selectedDoc = doc;
    this.actionType = action;
    this.reasonText = '';
    this.showReasonBox = true;
  }

  submitReason() {
    if (!this.selectedDoc || !this.actionType) return;

    const url =
      this.actionType === 'REJECT'
        ? 'http://localhost:8080/api/documents/reject'
        : 'http://localhost:8080/api/documents/return';

    this.http
      .post(url, {
        documentId: this.selectedDoc.documentId,
        remarks: this.reasonText,
      })
      .subscribe(() => {
        this.selectedDoc!.status =
          this.actionType === 'REJECT' ? 'REJECTED' : 'RETURNED_FOR_CORRECTION';

        this.selectedDoc!.remarks = this.reasonText;
        this.showReasonBox = false;
      });
  }

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
}
