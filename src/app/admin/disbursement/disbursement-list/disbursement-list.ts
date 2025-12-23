import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-admin-disbursement-list',
  imports: [CommonModule],
  templateUrl: './disbursement-list.html',
})
export class AdminDisbursementList {
  selectedId: string | null = null;

  disbursements = [
    {
      id: 'PL-2031',
      applicant: 'Rahul Sharma',
      amount: 500000,
      bank: 'HDFC Bank',
      status: 'READY',
    },
  ];

  openConfirm(id: string) {
    this.selectedId = id;
  }

  confirm() {
    alert(`Disbursement authorized for ${this.selectedId}`);
    this.selectedId = null;
  }

  cancel() {
    this.selectedId = null;
  }
}
