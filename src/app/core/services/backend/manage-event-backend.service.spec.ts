import { TestBed } from '@angular/core/testing';

import { ManageEventBackendService } from './manage-event-backend.service';

describe('ManageEventBackendService', () => {
  let service: ManageEventBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageEventBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
