import { TestBed } from '@angular/core/testing';

import { PlatformSettingsManagementService } from './platform-settings-management.service';

describe('PlatformSettingsManagementService', () => {
  let service: PlatformSettingsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformSettingsManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
