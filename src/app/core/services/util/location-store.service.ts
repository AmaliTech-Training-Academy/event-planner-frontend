import { Injectable, signal, effect } from '@angular/core';
import { StoredRecentLocation } from '../../models/recent-location.model';

const STORAGE_KEY = 'recent_locations';
const MAX_ITEMS = 5;

@Injectable({
    providedIn: 'root',
})
export class LocationStoreService {
    public readonly recentLocations = signal<StoredRecentLocation[]>(this.loadFromStorage());

    constructor() {
        effect(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recentLocations()));
        });
    }


    public addLocation(location: StoredRecentLocation): void {
        const current = this.recentLocations();
        const exists = current.some(l => l.address === location.address);

        let updated = exists
            ? current.filter(l => l.address !== location.address)
            : current;

        updated = [location, ...updated].slice(0, MAX_ITEMS);
        this.recentLocations.set(updated);
    }


    public removeLocation(address: string): void {
        const updated = this.recentLocations().filter(l => l.address !== address);
        this.recentLocations.set(updated);
    }

    public clear(): void {
        this.recentLocations.set([]);
        localStorage.removeItem(STORAGE_KEY);
    }

    private loadFromStorage(): StoredRecentLocation[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }
}
