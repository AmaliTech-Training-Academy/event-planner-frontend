import { TestBed } from '@angular/core/testing';

import { EventBackendServiceService } from './event-backend-service.service';

describe('EventBackendServiceService', () => {
  let service: EventBackendServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventBackendServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
