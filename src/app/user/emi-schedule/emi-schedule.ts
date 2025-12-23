import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type EmiStatus = 'PAID' | 'DUE' | 'UPCOMING';

@Component({
  selector: 'app-emi-schedule',
  imports: [CommonModule],
  templateUrl: './emi-schedule.html',
})
export class EmiSchedule {
  emis: { month: string; amount: number; status: EmiStatus }[] = [
    { month: 'Jan 2025', amount: 14500, status: 'PAID' },
    { month: 'Feb 2025', amount: 14500, status: 'PAID' },
    { month: 'Mar 2025', amount: 14500, status: 'DUE' },
    { month: 'Apr 2025', amount: 14500, status: 'UPCOMING' },
  ];

  payEmi(emi: any) {
    alert(`Proceed to payment for ${emi.month}`);
  }
}
