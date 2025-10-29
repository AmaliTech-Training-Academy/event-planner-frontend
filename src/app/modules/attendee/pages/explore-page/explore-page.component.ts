import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppEvent } from '../../../../core/models/event-model';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { TabToggleComponent, TabToggle } from '../../../../shared/components/tab-toggle/tab-toggle.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LocationDropdownComponent } from '../../../../shared/components/location-dropdown/location-dropdown.component';
import { FilterDropdownComponent } from '../../../../shared/components/filter-dropdown/filter-dropdown.component';

@Component({
  selector: 'app-explore-page',
  standalone: true,
  imports: [
    FormsModule,
    EventCardComponent,
    TabToggleComponent,
    ButtonComponent,
    LocationDropdownComponent,
    FilterDropdownComponent
   
  ],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss'
})
export class ExplorePageComponent {

  
  public searchQuery: string = '';

  public eventToggles: TabToggle[] = [
    { key: 'upcoming', label: 'Upcoming events' },
    { key: 'past', label: 'Past events' }
  ];
  public activeToggle: string = 'upcoming';

  public showLocationDropdown = false;
  public selectedLocation = 'Location'; 

  public showEventTypeDropdown = false;
  public selectedEventType = 'All Events'; 
  public eventTypeOptions = ['All Events', 'Paid Events', 'Free Events'];


  public recentSearches = [
    { name: 'New York, USA', id: 'ny' },
    { name: 'London, UK', id: 'ldn' }
  ];
  public popularLocations = [
    { name: 'San Francisco, USA', meta: 'California' },
    { name: 'Toronto, Canada', meta: 'Ontario' },
    { name: 'Sydney, Australia', meta: 'New South Wales' }
  ];


  public paidEvents: AppEvent[] = [
    { id: 'p1', imageUrl: 'images/event1.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250 },
    { id: 'p2', imageUrl: 'images/event2.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250 },
    { id: 'p3', imageUrl: 'images/event3.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250 },
    { id: 'p4', imageUrl: 'images/event3.jpg', date: 'Apr 29, 2025', title: 'Future of AI Panel', location: 'San Francisco, CA', attendees: 150 },
    { id: 'p5', imageUrl: 'images/event2.jpg', date: 'Apr 30, 2025', title: 'Angular Connect Live', location: 'San Francisco, CA', attendees: 450 },
    { id: 'p6', imageUrl: 'images/event3.jpg', date: 'May 01, 2025', title: 'Startup Pitch Night', location: 'San Francisco, CA', attendees: 300 }
  ];

  public freeEvents: AppEvent[] = [
    { id: 'f1', imageUrl: 'images/event1.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250 },
    { id: 'f2', imageUrl: 'images/event2.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250 },
    { id: 'f3', imageUrl: 'images/event3.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250 },
    { id: 'f4', imageUrl: 'images/event1.jpg', date: 'Apr 29, 2025', title: 'Open Source Meetup', location: 'San Francisco, CA', attendees: 80 },
    { id: 'f5', imageUrl: 'images/event2.jpg', date: 'Apr 30, 2025', title: 'Community Code Jam', location: 'San Francisco, CA', attendees: 120 },
    { id: 'f6', imageUrl: 'images/event3.jpg', date: 'May 01, 2025', title: 'Intro to Web3', location: 'San Francisco, CA', attendees: 95 }
  ];




  public onTabChange(selectedTabKey: string): void {
    this.activeToggle = selectedTabKey;
    console.log('Selected tab:', this.activeToggle);
  }

  public onSearchChange(): void {
    console.log('Searching for:', this.searchQuery);
    
  }

 
  public toggleLocationDropdown(): void {
    this.showLocationDropdown = !this.showLocationDropdown;
    this.showEventTypeDropdown = false;
  }

  public closeLocationDropdown(): void {
    this.showLocationDropdown = false;
  }

  public onLocationSelected(location: any): void {
    this.selectedLocation = location.name; 
    this.showLocationDropdown = false;     
    console.log('Selected location:', location);
    
  }

  public onUseCurrentLocation(): void {
    console.log('Using current location...');
    this.selectedLocation = 'Current Location';
    this.showLocationDropdown = false;
   
  }

  
  public toggleEventTypeDropdown(): void {
    this.showEventTypeDropdown = !this.showEventTypeDropdown;
    this.showLocationDropdown = false; 
  }

  public closeEventTypeDropdown(): void {
    this.showEventTypeDropdown = false;
  }

  public onEventTypeSelected(type: string): void {
    this.selectedEventType = type; 
    this.showEventTypeDropdown = false;
    console.log('Selected event type:', type);
  }

  
  public onLoadMorePaid(): void {
    console.log('Loading more PAID events...');
    
  }

  public onLoadMoreFree(): void {
    console.log('Loading more FREE events...');
   
  }
}

