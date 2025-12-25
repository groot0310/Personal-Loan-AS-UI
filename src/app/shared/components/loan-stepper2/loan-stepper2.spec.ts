import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanStepper2 } from './loan-stepper2';

describe('LoanStepper2', () => {
  let component: LoanStepper2;
  let fixture: ComponentFixture<LoanStepper2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanStepper2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanStepper2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
