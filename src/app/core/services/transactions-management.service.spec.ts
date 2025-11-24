import { TestBed } from '@angular/core/testing';

import { TransactionsManagementService } from './transactions-management.service';

describe('TransactionsManagementService', () => {
  let service: TransactionsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionsManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
