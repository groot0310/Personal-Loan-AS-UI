import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-loan-officer-applications',
  imports: [CommonModule, RouterModule],
  templateUrl: './applications.html',
})
export class Applications {
  applications = [
    {
      id: 'PL-1023',
      name: 'Rohit Sharma',
      amount: 500000,
      tenure: 36,
      status: 'NEW',
      date: '2025-01-10',
    },
    {
      id: 'PL-1024',
      name: 'Anita Verma',
      amount: 300000,
      tenure: 24,
      status: 'UNDER_REVIEW',
      date: '2025-01-09',
    },
  ];
}
