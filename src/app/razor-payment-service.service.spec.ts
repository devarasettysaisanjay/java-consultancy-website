import { TestBed } from '@angular/core/testing';

import { RazorPaymentServiceService } from './razor-payment-service.service';

describe('RazorPaymentServiceService', () => {
  let service: RazorPaymentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RazorPaymentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
