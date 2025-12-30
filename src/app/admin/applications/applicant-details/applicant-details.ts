import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

/* ================= INTERFACES ================= */

interface LoanApplication {
  applicationId: number;
  requestedAmount: number;
  tenureMonths?: number;
  calculatedEmi?: number;
  officerRemark?: string;
  user: {
    fullName: string;
  };
  documents: BackendDocument[];
}

interface BackendDocument {
  documentId?: number;
  documentType?: string;
  documentStatus?: 'UPLOADED' | 'VERIFIED' | 'REJECTED' | 'RETURNED_FOR_CORRECTION';
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
  selector: 'app-applicant-details',
  imports: [CommonModule],
  templateUrl: './applicant-details.html',
})
export class ApplicantDetails implements OnInit {
  private readonly API = 'http://localhost:8080/api/loan-applications';

  loading = true;
  error: string | null = null;

  application!: LoanApplication;
  documents: UIDocument[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Invalid application ID';
      this.loading = false;
      return;
    }

    this.loadApplication(id);
  }

  /* ================= LOAD APPLICATION ================= */

  loadApplication(id: string): void {
    this.loading = true;

    this.http
      .get<LoanApplication>(`${this.API}/${id}`)
      .pipe(
        tap((res) => {
          this.application = res;
          this.buildDocuments(res.documents || []);
        }),
        catchError((err) => {
          console.error(err);
          this.error = 'Failed to load application details';
          return of(null);
        })
      )
      .subscribe(() => (this.loading = false));
  }

  /* ================= DOCUMENT NORMALIZER ================= */

  private buildDocuments(backendDocs: BackendDocument[]): void {
    const REQUIRED_DOCUMENTS = ['AADHAAR', 'PAN', 'SALARY_SLIP', 'BANK_STATEMENT'];

    this.documents = REQUIRED_DOCUMENTS.map((type) => {
      const match = backendDocs.find((d) => d.documentType === type);

      return {
        documentId: match?.documentId,
        documentType: type,
        status: match?.documentStatus || 'NOT_UPLOADED',
        remarks: match?.remarks,
      };
    });
  }

  /* ================= DOCUMENT ACTIONS ================= */

  viewDocument(doc: UIDocument): void {
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

  verifyDocument(doc: UIDocument): void {
    if (!doc.documentId) return;
    doc.status = 'VERIFIED'; // backend sync can be added later
  }

  openReasonBox(doc: UIDocument, action: 'REJECT' | 'RETURN'): void {
    const reason = prompt(`Reason for ${action}`);
    if (!reason) return;

    doc.remarks = reason;
    doc.status = action === 'REJECT' ? 'REJECTED' : 'RETURNED_FOR_CORRECTION';
  }

  /* ================= APPROVE APPLICATION ================= */

  approveApplication(): void {
    const payload = {
      applicationId: this.application.applicationId,
      rejectionReason: null,
      remarks: 'Your loan is successfully approved',
    };

    this.http.put<{ message: string }>(`${this.API}/approve`, payload).subscribe({
      next: (res) => {
        // this.router.navigate(['/admin/applications']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to approve loan application');
      },
    });
  }

  private allDocumentsVerified(): boolean {
    return this.documents.every((d) => d.status === 'VERIFIED');
  }

  /* ================= APPROVE APPLICATION ================= */

  rejectApplication() {
    if (!this.allDocumentsVerified()) {
      alert('All documents must be VERIFIED before rejection');
      return;
    }

    const payload = {
      applicationId: this.application.applicationId,
      rejectionReason: 'Application rejected by admin',
      remarks: 'Your loan application has been rejected',
    };

    this.http.put<{ message: string }>(`${this.API}/reject`, payload).subscribe({
      next: (res) => {
        alert(res.message);
        this.router.navigate(['/admin/applicants']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to reject loan application');
      },
    });
  }
}
