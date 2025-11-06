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
  ],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss',
})
export class ExplorePageComponent implements OnInit {

  private allEvents = signal<EventCard[]>([]);
  public upcomingEvents = signal<EventCard[]>([]);
  public pastEvents = signal<EventCard[]>([]);
  public freeEvents = signal<EventCard[]>([]);
  public paidEvents = signal<EventCard[]>([]);

  private freeEventsPage = signal(1);
  private paidEventsPage = signal(1);
  private upcomingEventsPage = signal(1);
  private pastEventsPage = signal(1);
  private readonly EVENTS_PER_PAGE = 6;

  showingAllFree = computed(() => !this.hasMoreFreeEvents());
  showingAllPaid = computed(() => !this.hasMorePaidEvents());
  showingAllUpcoming = computed(() => !this.hasMoreUpcomingEvents());
  showingAllPast = computed(() => !this.hasMorePastEvents());

  searchQuery = signal('');
  selectedLocation = signal('Location');
  selectedEventType = signal('All Events');
  selectedDate = signal<Date | null>(null);

  showLocationDropdown = signal(false);
  showEventTypeDropdown = signal(false);
  showDatePicker = signal(false);
  activeToggle = signal<string>('all');

  eventToggles = signal<TabToggle[]>([]);
  eventTypeOptions = signal<string[]>([]);
  recentSearches = signal<SearchLocation[]>([]);
  popularLocations = signal<PopularLocation[]>([]);

  constructor(private router: Router) {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url.includes('/explore')) {

        this.activeToggle.set('all');
        this.resetPagination();
        this.filterEvents();
      }
    });
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;


    const clickedInsideDropdown = target.closest('.filter-dropdown-wrapper');

    if (!clickedInsideDropdown) {
      this.closeAllDropdowns();
    }
  }

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


  private closeAllDropdowns(): void {
    this.showLocationDropdown.set(false);
    this.showEventTypeDropdown.set(false);
    this.showDatePicker.set(false);
  }

  protected onTabChange(selectedTabKey: string): void {
    this.activeToggle.set(selectedTabKey);
    this.resetPagination();
    this.filterEvents();
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.resetPagination();
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
    this.resetPagination();
    this.filterEvents();
  }

  protected onUseCurrentLocation(): void {
    this.selectedLocation.set('Current Location');
    this.showLocationDropdown.set(false);
    this.resetPagination();
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
    this.resetPagination();
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
    this.resetPagination();
    this.filterEvents();
  }

  private resetPagination(): void {
    this.freeEventsPage.set(1);
    this.paidEventsPage.set(1);
    this.upcomingEventsPage.set(1);
    this.pastEventsPage.set(1);
  }

  private filterEvents(): void {
    const now = new Date();
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

    const toggleValue = this.activeToggle();

    if (toggleValue === 'upcoming') {
      const upcomingFiltered = events.filter((event) => event.date >= now);
      const upcomingToShow = upcomingFiltered.slice(0, this.upcomingEventsPage() * this.EVENTS_PER_PAGE);
      this.upcomingEvents.set(upcomingToShow);
      this.pastEvents.set([]);
      this.freeEvents.set([]);
      this.paidEvents.set([]);
    } else if (toggleValue === 'past') {
      const pastFiltered = events.filter((event) => event.date < now);
      const pastToShow = pastFiltered.slice(0, this.pastEventsPage() * this.EVENTS_PER_PAGE);
      this.pastEvents.set(pastToShow);
      this.upcomingEvents.set([]);
      this.freeEvents.set([]);
      this.paidEvents.set([]);
    } else {

      const freeFiltered = events.filter((event) => !event.isPaid);
      const paidFiltered = events.filter((event) => event.isPaid);

      const freeToShow = freeFiltered.slice(0, this.freeEventsPage() * this.EVENTS_PER_PAGE);
      const paidToShow = paidFiltered.slice(0, this.paidEventsPage() * this.EVENTS_PER_PAGE);

      this.freeEvents.set(freeToShow);
      this.paidEvents.set(paidToShow);
      this.upcomingEvents.set([]);
      this.pastEvents.set([]);
    }
  }

  protected hasMoreFreeEvents(): boolean {
    const allFree = this.getAllFilteredEvents().filter(e => !e.isPaid);
    return this.freeEvents().length < allFree.length;
  }

  protected hasMorePaidEvents(): boolean {
    const allPaid = this.getAllFilteredEvents().filter(e => e.isPaid);
    return this.paidEvents().length < allPaid.length;
  }

  protected hasMoreUpcomingEvents(): boolean {
    const now = new Date();
    const allUpcoming = this.getAllFilteredEvents().filter(e => e.date >= now);
    return this.upcomingEvents().length < allUpcoming.length;
  }

  protected hasMorePastEvents(): boolean {
    const now = new Date();
    const allPast = this.getAllFilteredEvents().filter(e => e.date < now);
    return this.pastEvents().length < allPast.length;
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

  protected onLoadMoreUpcoming(): void {
    this.upcomingEventsPage.update(page => page + 1);
    this.filterEvents();
  }

  protected onLoadMorePast(): void {
    this.pastEventsPage.update(page => page + 1);
    this.filterEvents();
  }

  protected onLoadMoreFree(): void {
    this.freeEventsPage.update(page => page + 1);
    this.filterEvents();
  }

  protected onLoadMorePaid(): void {
    this.paidEventsPage.update(page => page + 1);
    this.filterEvents();
  }

  protected onShowLessUpcoming(): void {
    this.upcomingEventsPage.set(1);
    this.filterEvents();
  }

  protected onShowLessPast(): void {
    this.pastEventsPage.set(1);
    this.filterEvents();
  }

  protected onShowLessFree(): void {
    this.freeEventsPage.set(1);
    this.filterEvents();
  }

  protected onShowLessPaid(): void {
    this.paidEventsPage.set(1);
    this.filterEvents();
  }
}