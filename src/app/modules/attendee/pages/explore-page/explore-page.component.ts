import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule,NgOptimizedImage } from '@angular/common'; 
import { AppEvent } from '../../../../core/models/event-model'; 
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { TabToggleComponent, TabToggle } from '../../../../shared/components/tab-toggle/tab-toggle.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LocationDropdownComponent } from '../../../../shared/components/location-dropdown/location-dropdown.component';
import { FilterDropdownComponent } from '../../../../shared/components/filter-dropdown/filter-dropdown.component';
import { FilterButtonComponent } from '../../../../shared/components/filter-button/filter-button.component';  
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component'; 

@Component({
  selector: 'app-explore-page',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule, 
    EventCardComponent,
    TabToggleComponent,
    ButtonComponent,
    LocationDropdownComponent,
    FilterDropdownComponent,
    FilterButtonComponent, 
    SearchInputComponent,
    NgOptimizedImage   
  ],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss'
})
export class ExplorePageComponent {
  
  
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

  
  recentSearches = [
    { name: 'New York, USA', id: 'ny' },
    { name: 'London, UK', id: 'ldn' }
  ];
  popularLocations = [
    { name: 'San Francisco, USA', meta: 'California' },
    { name: 'Toronto, Canada', meta: 'Ontario' },
    { name: 'Sydney, Australia', meta: 'New South Wales' }
  ];

  
  paidEvents: AppEvent[] = [
    { id: 'p1', imageUrl: 'images/event1.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250 },
    { id: 'p2', imageUrl: 'images/event2.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250 },
    { id: 'p3', imageUrl: 'images/event3.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250 },
    { id: 'p4', imageUrl: 'images/event3.jpg', date: 'Apr 29, 2025', title: 'Future of AI Panel', location: 'San Francisco, CA', attendees: 150 },
    { id: 'p5', imageUrl: 'images/event2.jpg', date: 'Apr 30, 2025', title: 'Angular Connect Live', location: 'San Francisco, CA', attendees: 450 },
    { id: 'p6', imageUrl: 'images/event3.jpg', date: 'May 01, 2025', title: 'Startup Pitch Night', location: 'San Francisco, CA', attendees: 300 }
  ];

  freeEvents: AppEvent[] = [
    { id: 'f1', imageUrl: 'images/event1.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250 },
    { id: 'f2', imageUrl: 'images/event2.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250 },
    { id: 'f3', imageUrl: 'images/event3.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250 },
    { id: 'f4', imageUrl: 'images/event1.jpg', date: 'Apr 29, 2025', title: 'Open Source Meetup', location: 'San Francisco, CA', attendees: 80 },
    { id: 'f5', imageUrl: 'images/event2.jpg', date: 'Apr 30, 2025', title: 'Community Code Jam', location: 'San Francisco, CA', attendees: 120 },
    { id: 'f6', imageUrl: 'images/event3.jpg', date: 'May 01, 2025', title: 'Intro to Web3', location: 'San Francisco, CA', attendees: 95 }
  ];
  
  
  
  
  onTabChange(selectedTabKey: string): void {
    this.activeToggle = selectedTabKey;
   
  }

  onSearchChange(): void {
   
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
    console.log('Using current location...');
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

