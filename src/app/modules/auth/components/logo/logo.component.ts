// shared/components/logo/logo.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformStateService } from '@app/core/services/platform-state.service';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  private readonly _platformStateService: PlatformStateService =
    inject(PlatformStateService);

  // Use the computed platform name from the state service
  public readonly platformName = this._platformStateService.platformName;
  public readonly platformLogo = this._platformStateService.platformLogo;
}
