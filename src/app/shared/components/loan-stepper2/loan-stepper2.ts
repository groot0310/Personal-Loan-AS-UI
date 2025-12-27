import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EligibilityService } from '../../../user/apply-loan/services/eligibility';
import { Router } from '@angular/router';
import { DocumentType } from '../../types/document-type';

@Component({
  selector: 'app-loan-stepper',
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
  ],
  templateUrl: './loan-stepper2.html',
  styleUrls: ['./loan-stepper2.css']
})
export class LoanStepperComponent {
  basicForm!: FormGroup;
  personalForm!: FormGroup;
  employmentForm!: FormGroup;

uploadedDocs: Record<DocumentType, boolean> = {
  AADHAAR: false,
  PAN: false,
  EMPLOYMENT_SLIP: false,
  ADDRESS_PROOF: false
};
applicationId: number = 0;

uploadedFiles: Partial<Record<DocumentType, any>> = {};




  documents: File[] = [];

  constructor(
    private fb: FormBuilder,
    private eligibilityService: EligibilityService,
    private router: Router
  ) {
    this.initializeForms();
  }

  private initializeForms() {
    // STEP 1 – BASIC
    this.basicForm = this.fb.group({
      loanType: ['PERSONAL', Validators.required],
      requestedAmount: [10000, Validators.required],
      tenureMonths: [12, Validators.required],
    });

    // STEP 2 – PERSONAL
    this.personalForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
    });

    // STEP 3 – EMPLOYMENT
    this.employmentForm = this.fb.group({
      employmentType: ['', Validators.required],
      monthlyIncome: ['', Validators.required],
      companyName: ['', Validators.required],
      panNumber: ['', Validators.required],
      aadhaarNumber: ['', Validators.required],
      bankAccount: ['', Validators.required],
      ifscCode: ['', Validators.required],
    });
  }


checkEligibility(stepper: any) {

  const payload = {
    ...this.basicForm.value,
    ...this.personalForm.value,
    ...this.employmentForm.value
  };

  this.eligibilityService.checkEligibility(payload).subscribe({
    next: (res) => {
      console.log('Eligibility Response:', res);
        this.applicationId = res.applicationId;
      // if (res.finalEligibility === true) {
        if (res.loanType === "PERSONAL") {
        // ✅ Move to Upload Documents
        stepper.next();
      } else {
        // ❌ Not eligible
        console.log('User is not eligible for the loan.');
        this.router.navigate(['user/not-eligible']);
      }
    },
    error: () => {
      alert('Eligibility check failed');
    }
  });
}


  onFileUpload(event: any) {
    this.documents = Array.from(event.target.files);
  }

  uploadDocument(event: Event, docType: DocumentType): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file: File = input.files[0];

  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', docType);
  formData.append('loanApplicationId', this.applicationId.toString());

  this.eligibilityService.uploadDocument(formData).subscribe({
    next: (res) => {
      console.log(`${docType} uploaded successfully`, res);

      this.uploadedDocs[docType] = true;
      this.uploadedFiles[docType] = res;

      // reset input so same file can be re-uploaded if needed
      input.value = '';
    },
    error: () => {
      this.uploadedDocs[docType] = false;
      alert(`Failed to upload ${docType}`);
    }
  });
}


allDocumentsUploaded(): boolean {
  return (
    this.uploadedDocs['AADHAAR'] &&
    this.uploadedDocs['PAN'] &&
    this.uploadedDocs['EMPLOYMENT_SLIP'] &&
    this.uploadedDocs['ADDRESS_PROOF']
  );
}




  submit() {
    const payload = {
      ...this.basicForm.value,
      ...this.personalForm.value,
      ...this.employmentForm.value,
      // documents: this.documents
       documents: this.uploadedFiles
    };

    console.log('FINAL PAYLOAD 🚀', payload);
    alert('Loan Application Submitted Successfully');
  }
}
