import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-admin-application-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './application-list.html',
})
export class ApplicationList {
  statusFilter: 'ALL' | 'PENDING_ADMIN' | 'APPROVED' | 'REJECTED' = 'ALL';

  applications = [
    {
      id: 'PL-2031',
      applicant: 'Rahul Sharma',
      amount: 500000,
      officer: 'Officer A',
      status: 'PENDING_ADMIN',
      appliedOn: '2025-01-12',
    },
    {
      id: 'PL-2032',
      applicant: 'Neha Verma',
      amount: 300000,
      officer: 'Officer B',
      status: 'APPROVED',
      appliedOn: '2025-01-11',
    },
  ];

  get filteredApplications() {
    if (this.statusFilter === 'ALL') return this.applications;
    return this.applications.filter((a) => a.status === this.statusFilter);
  }
}
