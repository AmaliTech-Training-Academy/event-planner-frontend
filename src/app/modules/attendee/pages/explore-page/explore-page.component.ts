import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule, NgOptimizedImage } from '@angular/common'; 
import { AppEvent } from '../../../../core/models/event-model';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { TabToggleComponent, TabToggle } from '../../../../shared/components/tab-toggle/tab-toggle.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LocationDropdownComponent } from '../../../../shared/components/location-dropdown/location-dropdown.component';
import { FilterDropdownComponent } from '../../../../shared/components/filter-dropdown/filter-dropdown.component';
import { FilterButtonComponent } from '../../../../shared/components/filter-button/filter-button.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { PopularLocation, RecentSearch } from '../../../../core/models/location-model';
import { ExploreDataService } from '../../../../core/services/explore-data.service';

@Component({
  selector: 'app-explore-page',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    NgOptimizedImage,
    EventCardComponent,
    TabToggleComponent,
    ButtonComponent,
    LocationDropdownComponent,
    FilterDropdownComponent,
    FilterButtonComponent,
    SearchInputComponent,
  ],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss' 
})
export class ExplorePageComponent implements OnInit {
  
 searchQuery: string = '';
     eventToggles: TabToggle[] = [
    { key: 'upcoming', label: 'Upcoming events' },
    { key: 'past', label: 'Past events' }
  ];
  activeToggle: string = 'upcoming';


  showLocationDropdown = false;
  selectedLocation = 'Location';

  showEventTypeDropdown = false;
  selectedEventType = 'All Events';
  eventTypeOptions = ['All Events', 'Paid Events', 'Free Events'];


  recentSearches: RecentSearch[] = [];
  popularLocations: PopularLocation[] = [];
  paidEvents: AppEvent[] = [];
  freeEvents: AppEvent[] = [];

  constructor(
    private exploreDataService: ExploreDataService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.exploreDataService.getRecentSearches().subscribe(data => {
      this.recentSearches = data;
    });
    
    this.exploreDataService.getPopularLocations().subscribe(data => {
      this.popularLocations = data;
    });
    
    this.exploreDataService.getPaidEvents().subscribe(data => {
      this.paidEvents = data;
    });
    
    this.exploreDataService.getFreeEvents().subscribe(data => {
      this.freeEvents = data;
    });
  }

  onSearchChange(): void {
  }

  onTabChange(selectedTabKey: string): void {
    this.activeToggle = selectedTabKey;
   
  }

  
   toggleLocationDropdown(): void {
    this.showLocationDropdown = !this.showLocationDropdown;
    this.showEventTypeDropdown = false; 
  }

  closeLocationDropdown(): void {
    this.showLocationDropdown = false;
  }

  onLocationSelected(location: any): void {
    this.selectedLocation = location.name;
    this.showLocationDropdown = false;
    
  }
  
     onUseCurrentLocation(): void {
    this.selectedLocation = 'Current Location';
    this.showLocationDropdown = false;
    
  }


  toggleEventTypeDropdown(): void {
    this.showEventTypeDropdown = !this.showEventTypeDropdown;
    this.showLocationDropdown = false; 
  }

  closeEventTypeDropdown(): void {
    this.showEventTypeDropdown = false;
  }

  onEventTypeSelected(type: string): void {
    this.selectedEventType = type;
    this.showEventTypeDropdown = false;
   
  }

  
  onLoadMorePaid(): void {
  }

  onLoadMoreFree(): void {
    
  }
}

