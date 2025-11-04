import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-location-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './location-dropdown.component.html',
  styleUrl: './location-dropdown.component.scss'
})
export class LocationDropdownComponent {
  // --- Angular Decorators ---
  @Input() public recentSearches: any[] = [];
  @Input() public popularLocations: any[] = [];

  @Output() public locationSelected = new EventEmitter<any>();
  @Output() public useCurrentLocation = new EventEmitter<void>();
  @Output() public close = new EventEmitter<void>();

  // --- Template-facing Methods ---
  public selectLocation(location: any, isRecent = false): void {
    // For recent searches, we just emit the object
    // For popular, we create a new object
    const selected = isRecent ? location : { name: `${location.name}, ${location.meta}`, id: location.name };
    this.locationSelected.emit(selected);
  }

  public removeRecent(event: Event, searchId: string): void {
    event.stopPropagation(); // Prevent dropdown from closing
    console.log('Removing recent search:', searchId);
    // TODO: Add logic to emit this removal
  }
}

