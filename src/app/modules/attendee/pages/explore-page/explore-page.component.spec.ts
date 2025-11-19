import { Component, OnInit, signal, computed, HostListener } from '@angular/core';
import { CommonModule, NgOptimizedImage, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { TabToggleComponent } from '../../../../shared/components/tab-toggle/tab-toggle.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LocationDropdownComponent } from '../../../../shared/components/location-dropdown/location-dropdown.component';
import { FilterDropdownComponent } from '../../../../shared/components/filter-dropdown/filter-dropdown.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker.component';
import { PaginationComponent } from '../../../../shared/admin-ui/pagination/pagination.component';

import {
  EventCard,
  TabToggle,
  SearchLocation,
  PopularLocation,
} from '../../../../core/models/event.model';

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
    PaginationComponent,
  ],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss',
})
export class ExplorePageComponent implements OnInit {

  private allEvents = signal<EventCard[]>([]);
  
  public currentPage = signal(1);
  public EVENTS_PER_PAGE = 12;
  
  public searchQuery = signal('');
  public selectedLocation = signal('Location');
  public selectedEventType = signal('All Events');
  public selectedDate = signal<Date | null>(null);
  public showLocationDropdown = signal(false);
  public showEventTypeDropdown = signal(false);
  public showDatePicker = signal(false);
  public activeToggle = signal<string>('all');
  public eventToggles = signal<TabToggle[]>([]);
  public eventTypeOptions = signal<string[]>([]);
  public recentSearches = signal<SearchLocation[]>([]);
  public popularLocations = signal<PopularLocation[]>([]);

  public activeEventList = computed(() => {
    const allFiltered = this.getAllFilteredEvents();
    const now = new Date();

    switch (this.activeToggle()) {
      case 'upcoming':
        return allFiltered.filter((event) => event.date >= now);
      case 'past':
        return allFiltered.filter((event) => event.date < now);
      case 'all':
      default:
        const paid = allFiltered.filter((event) => event.isPaid);
        const free = allFiltered.filter((event) => !event.isPaid);
        return [...paid, ...free];
    }
  });

  public totalEvents = computed(() => this.activeEventList().length);

  public paginatedEvents = computed(() => {
    const list = this.activeEventList();
    const page = this.currentPage();
    const start = (page - 1) * this.EVENTS_PER_PAGE;
    const end = start + this.EVENTS_PER_PAGE;
    return list.slice(start, end);
  });
  
  public activeListTitle = computed(() => {
    switch (this.activeToggle()) {
      case 'upcoming': return 'Upcoming Events';
      case 'past': return 'Past Events';
      case 'all':
      default:
        return 'All Events';
    }
  });

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url.includes('/explore')) {
        this.activeToggle.set('all');
        this.resetPagination();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.filter-dropdown-wrapper');

    if (!clickedInsideDropdown) {
      this.closeAllDropdowns();
    }
  }

  public ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.allEvents.set(MOCK_EVENT_CARDS);
    this.eventToggles.set(MOCK_EVENT_TOGGLES);
    this.eventTypeOptions.set(MOCK_EVENT_TYPE_OPTIONS);
    this.recentSearches.set(MOCK_RECENT_SEARCHES);
    this.popularLocations.set(MOCK_POPULAR_LOCATIONS);
  }

  private closeAllDropdowns(): void {
    this.showLocationDropdown.set(false);
    this.showEventTypeDropdown.set(false);
    this.showDatePicker.set(false);
  }

  protected onTabChange(selectedTabKey: string): void {
    this.activeToggle.set(selectedTabKey);
    this.resetPagination();
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.resetPagination();
  }

  protected onLocationSelected(location: SearchLocation): void {
    this.selectedLocation.set(location.name);
    this.showLocationDropdown.set(false);
    this.resetPagination();
  }

  protected onUseCurrentLocation(): void {
    this.selectedLocation.set('Current Location');
    this.showLocationDropdown.set(false);
    this.resetPagination();
  }

  protected onEventTypeSelected(type: string): void {
    this.selectedEventType.set(type);
    this.showEventTypeDropdown.set(false);
    this.resetPagination();
  }

  protected onDateSelected(date: Date): void {
    this.selectedDate.set(date);
    this.showDatePicker.set(false);
    this.resetPagination();
  }

  private getAllFilteredEvents(): EventCard[] {
    let events = this.allEvents();

    if (this.searchQuery()) {
      events = events.filter((event) =>
        event.title.toLowerCase().includes(this.searchQuery().toLowerCase())
      );
    }

    if (this.selectedLocation() !== 'Location') {
      events = events.filter((event) =>
        event.location.toLowerCase().includes(this.selectedLocation().toLowerCase())
      );
    }

    if (this.selectedEventType() !== 'All Events') {
      const isPaid = this.selectedEventType() === 'Paid Events';
      events = events.filter((event) => event.isPaid === isPaid);
    }

    if (this.selectedDate()) {
      events = events.filter((event) =>
        event.date.toDateString() === this.selectedDate()?.toDateString()
      );
    }

    return events;
  }
  
  public onPageChange(page: number): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private resetPagination(): void {
    this.currentPage.set(1);
  }

  protected toggleLocationDropdown(): void {
    this.showLocationDropdown.update((v) => !v);
    this.showEventTypeDropdown.set(false);
    this.showDatePicker.set(false);
  }

  protected closeLocationDropdown(): void {
    this.showLocationDropdown.set(false);
  }

  protected toggleEventTypeDropdown(): void {
    this.showEventTypeDropdown.update((v) => !v);
    this.showLocationDropdown.set(false);
    this.showDatePicker.set(false);
  }

  protected closeEventTypeDropdown(): void {
    this.showEventTypeDropdown.set(false);
  }

  protected toggleDatePicker(): void {
    this.showDatePicker.update((v) => !v);
    this.showLocationDropdown.set(false);
    this.showEventTypeDropdown.set(false);
  }
}