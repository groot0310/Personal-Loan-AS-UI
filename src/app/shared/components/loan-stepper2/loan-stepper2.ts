import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { EligibilityService } from '../../../user/apply-loan/services/eligibility';
import { Router } from '@angular/router';
import { DocumentType } from '../../types/document-type';

@Component({
  selector: 'app-loan-stepper2',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './loan-stepper2.html',
  styleUrls: ['./loan-stepper2.css']
})
export class LoanStepperComponent {
  basicForm!: FormGroup;
  personalForm!: FormGroup;
  employmentForm!: FormGroup;

  applicationId = 0;
  documents: File[] = [];

  uploadedDocs: Record<DocumentType, boolean> = {
    AADHAAR: false,
    PAN: false,
    SALARY_SLIP: false,
    BANK_STATEMENT: false
  };

  uploadedFiles: Partial<Record<DocumentType, any>> = {};

  /** ✅ SAFE BOOLEAN FOR TEMPLATE */
  allDocsUploaded = false;

  constructor(
    private fb: FormBuilder,
    private eligibilityService: EligibilityService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.basicForm = this.fb.group({
      loanType: ['PERSONAL', Validators.required],
      requestedAmount: [10000, Validators.required],
      tenureMonths: [12, Validators.required]
    });

    this.personalForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required]
    });

    this.employmentForm = this.fb.group({
      employmentType: ['', Validators.required],
      monthlyIncome: ['', Validators.required],
      companyName: ['', Validators.required],
      panNumber: ['', Validators.required],
      aadhaarNumber: ['', Validators.required],
      bankAccount: ['', Validators.required],
      ifscCode: ['', Validators.required]
    });
  }

  checkEligibility(stepper: any): void {
    const payload = {
      ...this.basicForm.value,
      ...this.personalForm.value,
      ...this.employmentForm.value
    };

    this.eligibilityService.checkEligibility(payload).subscribe({
      next: (res) => {
        this.applicationId = res.applicationId;

        if (res.loanType === 'PERSONAL') {
          stepper.next();
        } else {
          this.router.navigate(['user/not-eligible']);
        }
      },
      error: () => {
        alert('Eligibility check failed');
      }
    });
  }

  

onFileUpload(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  this.documents = Array.from(input.files);
}


  uploadDocument(event: Event, docType: DocumentType): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', docType);
    formData.append('loanApplicationId', this.applicationId.toString());

    this.eligibilityService.uploadDocument(formData).subscribe({
      next: (res) => {
        this.uploadedDocs[docType] = true;
        this.uploadedFiles[docType] = res;

        /** ✅ Update once, safely */
        this.allDocsUploaded =
          this.uploadedDocs.AADHAAR &&
          this.uploadedDocs.PAN &&
          this.uploadedDocs.SALARY_SLIP &&
          this.uploadedDocs.BANK_STATEMENT;

        this.cdr.detectChanges(); // ✅ Fix NG0100

        input.value = '';
      },
      error: () => {
        this.uploadedDocs[docType] = false;
        alert(`Failed to upload ${docType}`);
      }
    });
  }

  submit(): void {
    const payload = {
      ...this.basicForm.value,
      ...this.personalForm.value,
      ...this.employmentForm.value,
      documents: this.uploadedFiles
    };

    console.log('FINAL PAYLOAD 🚀', payload);

    this.snackBar.open(
      'Loan Application Submitted Successfully',
      'Close',
      {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['custom-snackbar']
      }
    );

    this.router.navigate(['user/dashboard']);
  }
}
