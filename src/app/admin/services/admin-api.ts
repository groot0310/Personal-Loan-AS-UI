import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  getDashboardStats() {
    return of({
      users: 1240,
      activeLoans: 860,
      pendingApplications: 12,
    });
  }

  getApplications() {
    return of([
      { id: 'PL-1023', applicant: 'Rahul', amount: 500000, status: 'PENDING' },
      { id: 'PL-1024', applicant: 'Anita', amount: 300000, status: 'PENDING' },
    ]);
  }

  authorizeDisbursement(id: string) {
    return of({ success: true });
  }
}
