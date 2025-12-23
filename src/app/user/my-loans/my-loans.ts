import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-my-loans',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-loans.html',
})
export class MyLoans {
  loans = [
    {
      loanId: 'PL-1023',
      amount: 500000,
      status: 'DOCUMENT_VERIFICATION',
    },
  ];
}
