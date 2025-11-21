import { TestBed } from '@angular/core/testing';

import { PlatformStateService } from './platform-state.service';

describe('PlatformStateService', () => {
  let service: PlatformStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
