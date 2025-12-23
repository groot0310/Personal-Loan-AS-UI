import { TestBed } from '@angular/core/testing';

import { ApplyLoanState } from './apply-loan-state';

describe('ApplyLoanState', () => {
  let service: ApplyLoanState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplyLoanState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
