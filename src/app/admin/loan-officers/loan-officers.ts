import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { LoanOfficer } from '../../core/models/loan-officer.model';
import { EditLoanOfficer } from '../edit-loan-officer/edit-loan-officer';
import { HeaderComponent } from '../../shared/header/header';

@Component({
  standalone: true,
  selector: 'app-loan-officers',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDialogModule,HeaderComponent],
  templateUrl: './loan-officers.html',
})
export class LoanOfficers {
  columns = ['fullName', 'email', 'mobileNumber', 'gender', 'dateOfBirth', 'actions'];
  dataSource: LoanOfficer[] = [];

  constructor(private dialog: MatDialog) {
    this.loadLoanOfficers();
  }

  loadLoanOfficers() {
    // 🔹 GET API
    this.dataSource = [
      {
        id: 1,
        fullName: 'Rahul Sharma',
        email: 'rahul@bank.com',
        mobileNumber: '9876543210',
        gender: 'Male',
        age: 30,
        dateOfBirth: '1994-01-01',
        address: 'MG Road',
        city: 'Mumbai',
        state: 'MH',
        pincode: '400001',
      },
    ];
  }

  openDialog(data?: LoanOfficer) {
    const dialogRef = this.dialog.open(EditLoanOfficer, {
      width: '700px',
      data: data || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadLoanOfficers();
      }
    });
  }
}
