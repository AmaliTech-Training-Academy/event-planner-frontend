import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { LocationStoreService } from '../../../core/services/util/location-store.service';
import { StoredRecentLocation } from '../../../core/models/recent-location.model';
import { POPULAR_SEARCHES } from './constant/popular-search.constant';


@Component({
  selector: 'app-location-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './location-dropdown.component.html',
  styleUrl: './location-dropdown.component.scss'
})
export class LocationDropdownComponent implements OnInit {

  protected recentSearches: StoredRecentLocation[] = [];
  protected popularSearch: StoredRecentLocation[] = POPULAR_SEARCHES;
  @Output() public locationSelected = new EventEmitter<StoredRecentLocation>();
  @Output() public close = new EventEmitter<void>();

  constructor(private readonly recentLocation: LocationStoreService) { }

  ngOnInit(): void {
    this.recentSearches = this.recentLocation.recentLocations()
  }


  protected selectLocation(location: StoredRecentLocation, isRecent = false): void {
    this.locationSelected.emit({address:location.address});
  }

  protected removeRecent(searchId: string): void {
    this.recentLocation.removeLocation(searchId)
  }
}

