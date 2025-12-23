import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  stats = [
    {
      label: 'Total Users',
      value: 1240,
      sub: '+12 today',
      color: 'text-indigo-600',
    },
    {
      label: 'Total Applications',
      value: 3120,
      sub: 'All time',
      color: 'text-blue-600',
    },
    {
      label: 'Pending Approvals',
      value: 18,
      sub: 'Action required',
      color: 'text-red-600',
      link: '/admin/applications',
    },
    {
      label: 'Amount Disbursed',
      value: '₹4.2 Cr',
      sub: 'This month',
      color: 'text-green-600',
    },
  ];

  pendingApprovals = [
    {
      id: 'PL-2031',
      amount: '₹5,00,000',
      officer: 'Officer A',
    },
    {
      id: 'PL-2032',
      amount: '₹3,00,000',
      officer: 'Officer B',
    },
  ];

  activities = [
    {
      text: 'Loan PL-2031 approved by Loan Officer',
      time: '10 mins ago',
    },
    {
      text: 'Documents verified for PL-2030',
      time: '1 hour ago',
    },
    {
      text: 'Disbursement completed for PL-2028',
      time: 'Yesterday',
    },
  ];
}
