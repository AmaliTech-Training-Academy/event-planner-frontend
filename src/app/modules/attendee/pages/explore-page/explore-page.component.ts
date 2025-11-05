import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Import all the components your HTML template uses
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { TabToggleComponent } from '../../../../shared/components/tab-toggle/tab-toggle.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LocationDropdownComponent } from '../../../../shared/components/location-dropdown/location-dropdown.component';
import { FilterDropdownComponent } from '../../../../shared/components/filter-dropdown/filter-dropdown.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker.component';

// Import all models
import {
  EventCard,
  TabToggle,
  SearchLocation,
  PopularLocation,
} from '../../../../core/models/event.model';

// Import all mock data
import {
  MOCK_EVENT_CARDS,
  MOCK_EVENT_TOGGLES,
  MOCK_EVENT_TYPE_OPTIONS,
  MOCK_RECENT_SEARCHES,
  MOCK_POPULAR_LOCATIONS,
} from '../../../../core/data/mock-data';

@Component({
  selector: 'app-explore-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    RouterModule,
    NgOptimizedImage,
    DatePipe,
    EventCardComponent,
    TabToggleComponent,
    ButtonComponent,
    LocationDropdownComponent,
    FilterDropdownComponent,
    SearchInputComponent,
    DatePickerComponent,
  ],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss',
})
export class ExplorePageComponent implements OnInit {
  // --- Signals for Data ---
  private allEvents = signal<EventCard[]>([]);
  public upcomingEvents = signal<EventCard[]>([]);
  public pastEvents = signal<EventCard[]>([]);

  // --- Signals for Filters ---
  public searchQuery = signal('');
  public selectedLocation = signal('Location');
  public selectedEventType = signal('All Events');
  public selectedDate = signal<Date | null>(null);

  // --- Signals for UI State ---
  public showLocationDropdown = signal(false);
  public showEventTypeDropdown = signal(false);
  public showDatePicker = signal(false);
  public activeToggle = signal('upcoming');

  // --- Signals for Dropdown Options ---
  public eventToggles = signal<TabToggle[]>([]);
  public eventTypeOptions = signal<string[]>([]);
  public recentSearches = signal<SearchLocation[]>([]);
  public popularLocations = signal<PopularLocation[]>([]);

  // --- Lifecycle Hooks ---
  public ngOnInit(): void {
    this.loadData();
    this.filterEvents();
  }

  // --- Data Loading ---
  private loadData(): void {
    // Load all data from mock files
    this.allEvents.set(MOCK_EVENT_CARDS);
    this.eventToggles.set(MOCK_EVENT_TOGGLES);
    this.eventTypeOptions.set(MOCK_EVENT_TYPE_OPTIONS);
    this.recentSearches.set(MOCK_RECENT_SEARCHES);
    this.popularLocations.set(MOCK_POPULAR_LOCATIONS);
  }

  // --- Event Handlers ---

  protected onTabChange(selectedTabKey: string): void {
    this.activeToggle.set(selectedTabKey);
    this.filterEvents();
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.filterEvents();
  }

  protected toggleLocationDropdown(): void {
    this.showLocationDropdown.update((v) => !v);
    this.showEventTypeDropdown.set(false);
    this.showDatePicker.set(false);
  }

  protected closeLocationDropdown(): void {
    this.showLocationDropdown.set(false);
  }

  protected onLocationSelected(location: SearchLocation): void {
    this.selectedLocation.set(location.name);
    this.showLocationDropdown.set(false);
    this.filterEvents();
  }

  protected onUseCurrentLocation(): void {
    this.selectedLocation.set('Current Location');
    this.showLocationDropdown.set(false);
    this.filterEvents();
  }

  protected toggleEventTypeDropdown(): void {
    this.showEventTypeDropdown.update((v) => !v);
    this.showLocationDropdown.set(false);
    this.showDatePicker.set(false);
  }

  protected closeEventTypeDropdown(): void {
    this.showEventTypeDropdown.set(false);
  }

  protected onEventTypeSelected(type: string): void {
    this.selectedEventType.set(type);
    this.showEventTypeDropdown.set(false);
    this.filterEvents();
  }

  protected toggleDatePicker(): void {
    this.showDatePicker.update((v) => !v);
    this.showLocationDropdown.set(false);
    this.showEventTypeDropdown.set(false);
  }

  protected onDateSelected(date: Date): void {
    this.selectedDate.set(date);
    this.showDatePicker.set(false);
    this.filterEvents();
  }

  // --- Main Filtering Logic ---
  private filterEvents(): void {
    const now = new Date();
    let events = this.allEvents();

    // 1. Filter by Search Query
    if (this.searchQuery()) {
      events = events.filter((event) =>
        event.title.toLowerCase().includes(this.searchQuery().toLowerCase())
      );
    }

    // 2. Filter by Location
    if (this.selectedLocation() !== 'Location') {
      events = events.filter((event) =>
        event.location.toLowerCase().includes(this.selectedLocation().toLowerCase())
      );
    }

    // 3. Filter by Event Type
    // This is the logic you're asking about!
    // It only filters if the type is *not* "All Events".
    if (this.selectedEventType() !== 'All Events') {
      const isPaid = this.selectedEventType() === 'Paid Events';
      events = events.filter((event) => event.isPaid === isPaid);
    }

    // 4. Filter by Date
    if (this.selectedDate()) {
      events = events.filter((event) =>
        event.date.toDateString() === this.selectedDate()?.toDateString()
      );
    }

    // 5. Separate into Upcoming and Past
    this.upcomingEvents.set(
      events.filter((event) => event.date >= now)
    );
    this.pastEvents.set(
      events.filter((event) => event.date < now)
    );
  }

  // --- Load More Handlers ---
  protected onLoadMoreUpcoming(): void {
    // In a real app, you'd fetch more data here.
  }

  protected onLoadMorePast(): void {
    // In a real app, you'd fetch more data here.
  }
}

