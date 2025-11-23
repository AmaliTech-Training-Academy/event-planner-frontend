import { Injectable, signal, WritableSignal, Signal } from '@angular/core';
import { DEFAULT_SECURITY_SETTINGS } from '@app/core/constants/admin-settings.constants';

@Injectable({
    providedIn: 'root',
})
export class PlatformSettingsService {
    private readonly _platformName: WritableSignal<string> = signal<string>(
        DEFAULT_SECURITY_SETTINGS.platformName
    );

    public readonly platformName: Signal<string> =
        this._platformName.asReadonly();

    /**
     * Updates the platform name
     * @param name New platform name
     */
    public updatePlatformName(name: string): void {
        this._platformName.set(name);
    }

    /**
     * Resets platform name to default
     */
    public resetPlatformName(): void {
        this._platformName.set(DEFAULT_SECURITY_SETTINGS.platformName);
    }
}
