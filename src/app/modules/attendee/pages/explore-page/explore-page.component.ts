import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { TabToggleComponent } from '../../../../shared/components/tab-toggle/tab-toggle.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LocationDropdownComponent } from '../../../../shared/components/location-dropdown/location-dropdown.component';
import { FilterDropdownComponent } from '../../../../shared/components/filter-dropdown/filter-dropdown.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';

// Models
import {
  EventCard,
  TabToggle,
  SearchLocation,
  PopularLocation,
} from '../../../../core/models/event.model';

// Mock Data
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
  ],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss',
  providers: [DatePipe], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorePageComponent implements OnInit {
  // --- Page Data ---
  private allEvents = signal<EventCard[]>([]);
  public upcomingEvents = signal<EventCard[]>([]);
  public pastEvents = signal<EventCard[]>([]);

  // --- Filter Bar State ---
  public searchQuery = signal('');
  public selectedLocation = signal('Location');
  public selectedEventType = signal('All Events');
  public selectedDate = signal<Date | null>(null);

  // --- Dropdown/Toggle State ---
  public eventToggles = signal<TabToggle[]>([]);
  public activeToggle = signal('upcoming');
  public showLocationDropdown = signal(false);
  public showEventTypeDropdown = signal(false);

  // --- Dropdown Data ---
  public eventTypeOptions = signal<string[]>([]);
  public recentSearches = signal<SearchLocation[]>([]);
  public popularLocations = signal<PopularLocation[]>([]);

  public ngOnInit(): void {
    this.loadData();
    this.filterEvents();
  }

  private loadData(): void {
    this.allEvents.set(MOCK_EVENT_CARDS);
    this.eventToggles.set(MOCK_EVENT_TOGGLES);
    this.eventTypeOptions.set(MOCK_EVENT_TYPE_OPTIONS);
    this.recentSearches.set(MOCK_RECENT_SEARCHES);
    this.popularLocations.set(MOCK_POPULAR_LOCATIONS);
  }

  // --- Event Handlers ---
  protected onTabChange(tabKey: string): void {
    this.activeToggle.set(tabKey);
    this.filterEvents();
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.filterEvents();
  }

  protected onLocationSelected(location: SearchLocation | PopularLocation): void {
    this.selectedLocation.set(location.name);
    this.showLocationDropdown.set(false);
    this.filterEvents();
  }

  protected onUseCurrentLocation(): void {
    this.selectedLocation.set('Current Location');
    this.showLocationDropdown.set(false);
    this.filterEvents();
  }

  protected onEventTypeSelected(type: string): void {
    this.selectedEventType.set(type);
    this.showEventTypeDropdown.set(false);
    this.filterEvents();
  }

  protected onDateSelected(dateString: string): void {
    if (dateString) {
      const parts = dateString.split('-').map((part) => parseInt(part, 10));
      this.selectedDate.set(new Date(parts[0], parts[1] - 1, parts[2]));
    } else {
      this.selectedDate.set(null);
    }
    this.filterEvents();
  }

  protected toggleLocationDropdown(): void {
    this.showLocationDropdown.update((v) => !v);
    this.showEventTypeDropdown.set(false);
  }

  protected toggleEventTypeDropdown(): void {
    this.showEventTypeDropdown.update((v) => !v);
    this.showLocationDropdown.set(false);
  }

  protected closeLocationDropdown(): void {
    this.showLocationDropdown.set(false);
  }

  protected closeEventTypeDropdown(): void {
    this.showEventTypeDropdown.set(false);
  }

  protected onLoadMoreUpcoming(): void {
    // Logic to load more upcoming events
  }

  protected onLoadMorePast(): void {
    // Logic to load more past events
  }

  // --- Main Filtering Logic ---
  private filterEvents(): void {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let events = this.allEvents();

    if (this.searchQuery()) {
      events = events.filter((event) =>
        event.title.toLowerCase().includes(this.searchQuery().toLowerCase())
      );
    }

    if (
      this.selectedLocation() !== 'Location' &&
      this.selectedLocation() !== 'Current Location'
    ) {
      events = events.filter((event) =>
        event.location.toLowerCase().includes(this.selectedLocation().toLowerCase())
      );
    }

    if (this.selectedEventType() === 'Paid Events') {
      events = events.filter((event) => event.isPaid);
    } else if (this.selectedEventType() === 'Free Events') {
      events = events.filter((event) => !event.isPaid);
    }

    if (this.selectedDate()) {
      const selectedDay = this.selectedDate()!.getTime();
      events = events.filter((event) => {
        const eventDay = new Date(event.date).setHours(0, 0, 0, 0);
        return eventDay === selectedDay;
      });
    }

    this.upcomingEvents.set(
      events.filter((event) => new Date(event.date) >= now)
    );
    this.pastEvents.set(
      events.filter((event) => new Date(event.date) < now)
    );
  }
}

