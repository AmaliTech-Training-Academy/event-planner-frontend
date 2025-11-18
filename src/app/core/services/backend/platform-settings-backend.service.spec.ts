import { TestBed } from '@angular/core/testing';

import { PlatformSettingsBackendService } from './platform-settings-backend.service';

describe('PlatformSettingsBackendService', () => {
  let service: PlatformSettingsBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformSettingsBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
