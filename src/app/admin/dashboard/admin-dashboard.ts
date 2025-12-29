import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface LoanApplication {
  applicationId: number;
  applicantName: string;
  loanType: string;
  requestedAmount: number;
  tenureMonths: number;
  calculatedEmi: number;
  applicationStatus: string;
  appliedAt: string;
  finalEligibility: boolean;
  userId: number;
}

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './admin-dashboard.html',
})



export class AdminDashboard implements OnInit{


  applications: any[] = [];

  // dropdown values
  statuses = [
    'DOCUMENT_APPROVED',
    'DOCUMENT_PENDING',
    'REJECTED',
    'APPROVED'
  ];

  selectedStatus = 'DOCUMENT_APPROVED';

  constructor(private http: HttpClient) {}

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


  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.http
      .get<any>(`http://localhost:8080/api/loan-applications?status=${this.selectedStatus}`)
      .subscribe(res => {
        this.applications = res.content; // <-- IMPORTANT
      });
  }

  onStatusChange() {
    this.loadApplications();
  }

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
