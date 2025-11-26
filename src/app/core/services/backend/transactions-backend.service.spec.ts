import { TestBed } from '@angular/core/testing';

import { TransactionsBackendService } from './transactions-backend.service';

describe('TransactionsBackendService', () => {
  let service: TransactionsBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionsBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
