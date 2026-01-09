import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header';

@Component({
  standalone: true,
  selector: 'app-loan-officer-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  stats = [
    { label: 'Assigned Applications', value: 24 },
    { label: 'Pending Review', value: 8 },
    { label: 'Documents Pending', value: 5 },
    { label: 'Approved Today', value: 3 },
  ];

  pendingTasks = [
    {
      id: 'PL-3011',
      applicant: 'Amit Shah',
      stage: 'DOCUMENT_VERIFICATION',
      daysPending: 2,
    },
    {
      id: 'PL-3014',
      applicant: 'Sneha Patel',
      stage: 'READY_FOR_REVIEW',
      daysPending: 1,
    },
  ];
}
