import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SanctionLetterDialogComponent } from './sanction-letter-dialog-component/sanction-letter-dialog-component';

interface LoanApplication {
  applicationId: number;
  loanType: string;
  requestedAmount: number;
  tenureMonths: number;
  calculatedEmi: number;
  applicationStatus: string;
  appliedAt: string;
}
interface LoanApiResponse {
  content: LoanApplication[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}



@Component({
  standalone: true,
  selector: 'app-my-loans',
  imports: [CommonModule, 
    RouterLink,MatTabsModule,HttpClientModule,
    MatButtonModule
  ],
  templateUrl: './my-loans.html',
})
export class MyLoans {
  loans = [
    {
      loanId: 'PL-1023',
      amount: 500000,
      status: 'DOCUMENT_VERIFICATION',
    },
  ];

  loanApplications: any[] = [];
  isLoading = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getLoans();
  }
getLoans() {
  this.http
    .get<LoanApiResponse>(
      'http://localhost:8080/api/loan-applications/user',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    .subscribe({
      next: (res) => {
        console.log('FULL RESPONSE', res);          // ✅ debug
        console.log('CONTENT ARRAY', res.content);  // ✅ debug

        this.loanApplications = res.content;        // ✅ FIX
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API ERROR', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
}


openSanctionLetter(loanApplicationId: number) {
  this.dialog.open(SanctionLetterDialogComponent, {
    width: '600px',
    data: { loanApplicationId }
  });
}
}
