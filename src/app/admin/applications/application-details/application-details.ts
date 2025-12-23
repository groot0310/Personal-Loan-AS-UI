import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-application-details',
  imports: [CommonModule],
  templateUrl: './application-details.html',
})
export class ApplicationDetails {
  applicationId = '';

  application = {
    applicant: 'Rahul Sharma',
    amount: 500000,
    tenure: 36,
    creditScore: 742,
    officerRemark: 'Documents verified. Eligible.',
    status: 'PENDING_ADMIN',
  };

  constructor(private route: ActivatedRoute) {
    this.applicationId = this.route.snapshot.paramMap.get('id')!;
  }

  approve() {
    alert(`Application ${this.applicationId} approved`);
  }

  reject() {
    alert(`Application ${this.applicationId} rejected`);
  }
}
