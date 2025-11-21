import { Component, inject, Signal } from '@angular/core';
import { PlatformSettingsService } from '@app/core/services/platform-settings.service';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
  private readonly _platformSettingsService = inject(PlatformSettingsService);

  public readonly platformName: Signal<string> = this._platformSettingsService.platformName;
}
