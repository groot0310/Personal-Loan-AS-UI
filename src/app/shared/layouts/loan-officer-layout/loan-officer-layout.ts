import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-loan-officer-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './loan-officer-layout.html',
})
export class LoanOfficerLayout {
darkMode: any;
role: any;
toggleTheme() {
throw new Error('Method not implemented.');
}
}
