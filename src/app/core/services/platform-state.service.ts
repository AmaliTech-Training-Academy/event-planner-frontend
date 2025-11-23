// core/services/platform-state.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { SecuritySettings } from '../models/platform-settings.model';
import { PlatformSettingsService } from './platform-settings-management.service';

@Injectable({ providedIn: 'root' })
export class PlatformStateService {
  private readonly _platformSettingsService: PlatformSettingsService = inject(
    PlatformSettingsService
  );

  // Reactive signals for platform state
  private readonly _platformName = signal<string>('EventHub');
  private readonly _platformSettings = signal<SecuritySettings | null>(null);

  // Public computed signals
  public readonly platformName = computed(() => this._platformName());
  public readonly platformSettings = computed(() => this._platformSettings());
  public readonly platformLogo = computed(() => {
    const name = this._platformName();
    const words = name.split(' ');
    if (words.length >= 2) {
      return `<span>${words[0]}</span>${words.slice(1).join(' ')}`;
    }
    return `<span>${name}</span>`;
  });

  constructor() {
    this._initializePlatformState();
  }

  private _initializePlatformState(): void {
    // Subscribe to security settings changes
    this._platformSettingsService.securitySettings$.subscribe({
      next: (settings: SecuritySettings | null): void => {
        if (settings) {
          this._platformSettings.set(settings);
          this._platformName.set(settings.platformName || 'EventHub');
        }
      },
      error: (error: any): void => {
        console.error('Failed to load platform settings:', error);
      },
    });
  }

  public updatePlatformName(newName: string): void {
    this._platformName.set(newName);
  }

  public refreshPlatformSettings(): void {
    this._platformSettingsService.loadSecuritySettings().subscribe();
  }
}
