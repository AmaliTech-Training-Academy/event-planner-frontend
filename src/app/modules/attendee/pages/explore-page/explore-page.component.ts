import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, HostListener, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker.component';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { FilterDropdownComponent } from '../../../../shared/components/filter-dropdown/filter-dropdown.component';
import { LocationDropdownComponent } from '../../../../shared/components/location-dropdown/location-dropdown.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { TabToggleComponent } from '../../../../shared/components/tab-toggle/tab-toggle.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

import {
  EventTypeFilter,
  GetEventProps,
  GetEventsResponse,
  PopularLocation,
  SearchLocation,
  TabToggle
} from '../../../../core/models/event.model';

import {
  MOCK_EVENT_TOGGLES,
  MOCK_EVENT_TYPE_OPTIONS,
  MOCK_POPULAR_LOCATIONS,
  MOCK_RECENT_SEARCHES
} from '../../../../core/data/mock-data';
import { EventsServiceService } from '../../../../core/services/events.service';
import { LocationSearchComponent } from "../../../../shared/components/location-search/location-search.component";
import { StoredRecentLocation } from '../../../../core/models/recent-location.model';

@Component({
  selector: 'app-explore-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DatePipe,
    EventCardComponent,
    TabToggleComponent,
    ButtonComponent,
    LocationDropdownComponent,
    FilterDropdownComponent,
    SearchInputComponent,
    DatePickerComponent,
    LocationSearchComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss',
})
export class ExplorePageComponent implements OnInit {

  protected allEvents = signal<GetEventsResponse | null>(null);
  private freeEventsPage = signal(1);
  private paidEventsPage = signal(1);
  private upcomingEventsPage = signal(1);
  private pastEventsPage = signal(1);
  private readonly EVENTS_PER_PAGE = 12;


  protected locationTerm = signal<string>('');
  protected locationInputFocused = signal<boolean>(false)
  public searchQuery = signal('');
  public selectedLocation = signal('Location');
  public selectedEventType = signal(MOCK_EVENT_TYPE_OPTIONS[0]);
  public selectedDate = signal<Date | null>(null);
  public showLocationDropdown = signal(false);
  public showEventTypeDropdown = signal(false);
  public showDatePicker = signal(false);
  public activeToggle = signal<boolean | null>(null);
  public eventToggles = signal<TabToggle[]>([]);
  public eventTypeOptions = signal<EventTypeFilter[]>([]);
  public recentSearches = signal<SearchLocation[]>([]);
  public popularLocations = signal<PopularLocation[]>([]);

  constructor(private readonly router: Router, private readonly eventService: EventsServiceService) {
  

    effect(() => {
      const isPaid = this.selectedEventType().value;
      const past = this.activeToggle();
      const date = this.selectedDate();
      const searchTerm = this.searchQuery();
      const locationTerm = this.locationTerm();

      this.searchEvents(isPaid, past, date, searchTerm, locationTerm);
    });

    effect(() => {
      const term = this.locationTerm();
      const isFocused = this.locationInputFocused();

      if (!isFocused) {
        this.closeLocationDropdown();
        return;
      }

      if (term.trim() === "") {
        this.openLocationDropdown();
      } else {
        this.closeLocationDropdown();
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
    this.eventService.getEvents({ pageSize: this.EVENTS_PER_PAGE }).subscribe({
      next: (events) => {
        this.allEvents.set(events)
      },
    })
    this.eventToggles.set(MOCK_EVENT_TOGGLES);
    this.eventTypeOptions.set(MOCK_EVENT_TYPE_OPTIONS);
    this.recentSearches.set(MOCK_RECENT_SEARCHES);
    this.popularLocations.set(MOCK_POPULAR_LOCATIONS);
  }

  private searchEvents(isPaid: string, past: boolean | null, date: Date | null, searchTerm: string, locationTerm: string) {
    let props: GetEventProps = {};

    if (isPaid !== '') {
      props.priceFilter = isPaid
    }

    if (typeof past === 'boolean') {
      props.past = past
    }

    if (date instanceof Date) {
      props.date = this.formatDate(date);
    }

    if (searchTerm !== '') {
      props.hasTitle = searchTerm;
    }

    if (locationTerm !== '') {
      props.location = locationTerm;
    }

    this.eventService.getEvents({ ...props, pageSize: this.EVENTS_PER_PAGE }).subscribe({
      next: (events) => {
        this.allEvents.set(events)
      },
    })
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  protected onFocusHandler() {
    if (this.locationTerm() === '') {
      this.openLocationDropdown();
    }
  }


  private closeAllDropdowns(): void {
    this.showLocationDropdown.set(false);
    this.showEventTypeDropdown.set(false);
    this.showDatePicker.set(false);
  }


  protected onTabChange(selectedTabKey: boolean | null): void {
    this.activeToggle.set(selectedTabKey);
    this.resetPagination();
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.resetPagination();
  }


  protected toggleLocationDropdown(): void {
    this.showLocationDropdown.update((v) => !v);
    this.showEventTypeDropdown.set(false);
    this.showDatePicker.set(false);
  }

  protected closeLocationDropdown(): void {
    this.showLocationDropdown.set(false);
  }
  protected openLocationDropdown(): void {
    this.showLocationDropdown.set(true);
  }

  protected onLocationSelected(location: StoredRecentLocation): void {
    this.locationTerm.update(()=>location.address);
    this.showLocationDropdown.set(false);
    this.resetPagination();
  }

  protected async onUseCurrentLocation(): Promise<void> {
    this.selectedLocation.set('Current Location');
    this.showLocationDropdown.set(false);
    this.resetPagination();
  }


  protected toggleEventTypeDropdown(): void {
    this.showEventTypeDropdown.update((v) => !v);
    this.showLocationDropdown.set(false);
    this.showDatePicker.set(false);
  }

  protected closeEventTypeDropdown(): void {
    this.showEventTypeDropdown.set(false);
  }

  protected onEventTypeSelected(type: EventTypeFilter): void {
    this.selectedEventType.set(type);
    this.showEventTypeDropdown.set(false);
    this.resetPagination();
  }


  protected toggleDatePicker(): void {
    this.showDatePicker.update((v) => !v);
    this.showLocationDropdown.set(false);
    this.showEventTypeDropdown.set(false);
  }

  protected onDateSelected(date: Date): void {
    this.selectedDate.set(date);
    this.showDatePicker.set(false);
    this.resetPagination();
  }

  private resetPagination(): void {
    this.freeEventsPage.set(1);
    this.paidEventsPage.set(1);
    this.upcomingEventsPage.set(1);
    this.pastEventsPage.set(1);
  }


  private getAllFilteredEvents() {
    let events = this.allEvents();

  }


  protected onLoadMoreUpcoming(): void {
    this.upcomingEventsPage.update(page => page + 1);
  }

  protected onLoadMorePast(): void {
    this.pastEventsPage.update(page => page + 1);
  }

  protected onLoadMoreFree(): void {
    this.freeEventsPage.update(page => page + 1);
  }

  protected onLoadMorePaid(): void {
    this.paidEventsPage.update(page => page + 1);
  }


  protected onShowLessUpcoming(): void {
    this.upcomingEventsPage.set(1);
  }

  protected onShowLessPast(): void {
    this.pastEventsPage.set(1);
  }

  protected onShowLessFree(): void {
    this.freeEventsPage.set(1);
  }

  protected onShowLessPaid(): void {
    this.paidEventsPage.set(1);
  }
}