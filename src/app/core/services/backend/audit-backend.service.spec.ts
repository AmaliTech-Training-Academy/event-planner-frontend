import { TestBed } from '@angular/core/testing';

import { AuditBackendService } from './audit-backend.service';

describe('AuditBackendService', () => {
  let service: AuditBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
