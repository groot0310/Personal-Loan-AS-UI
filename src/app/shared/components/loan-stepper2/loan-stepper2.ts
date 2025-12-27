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
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './loan-stepper2.html',
})
export class LoanStepperComponent {
  basicForm!: FormGroup;
  personalForm!: FormGroup;
  employmentForm!: FormGroup;

  documents: File[] = [];
  issubmitted = false;

  constructor(
    private fb: FormBuilder,
    private eligibilityService: EligibilityService,
    private router: Router,
    private snackBar: MatSnackBar
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

  onFileUpload(event: any) {
    this.documents = Array.from(event.target.files);
  }

  checkEligibility(stepper: any) {
    const payload = {
      ...this.basicForm.value,
      ...this.personalForm.value,
      ...this.employmentForm.value,
    };

    this.eligibilityService.checkEligibility(payload).subscribe({
      next: (res) => {
        console.log('Eligibility Response:', res);
        if (res.finalEligibility === true) {
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
      },
    });
  }

  submit() {
    const payload = {
      ...this.basicForm.value,
      ...this.personalForm.value,
      ...this.employmentForm.value,
      documents: this.documents,
    };

    console.log('FINAL PAYLOAD 🚀', payload);

    // show success popup and redirect to dashboard
    this.issubmitted = true;
    const ref = this.snackBar.open('Your loan application has been successfully submitted.', 'OK', {
      duration: 2500,
    });

    ref.afterDismissed().subscribe(() => {
      this.router.navigate(['/user/dashboard']);
    });
  }
}
