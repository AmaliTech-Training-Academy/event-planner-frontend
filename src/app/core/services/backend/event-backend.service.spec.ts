import { TestBed } from '@angular/core/testing';

import { EventBackendService } from './event-backend.service';

describe('EventBackendService', () => {
  let service: EventBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
