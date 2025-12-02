import { NgOptimizedImage } from '@angular/common';
import { Component, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TicketType } from '@app/core/models/event.model';
import { Registrants } from '@app/core/models/manage-events';
import { ManageEventService } from '@app/core/services/manage-event.service';
import { PaginationComponent } from "@app/shared/admin-ui/pagination/pagination.component";
import { LoadingCardComponent } from "@app/shared/components/loading-card/loading-card.component";
import { InputComponent } from "@app/shared/ui/input/input.component";
import { Registration } from '../../manage-event-page.component';

@Component({
  selector: 'app-registration',
  imports: [
    NgOptimizedImage,
    InputComponent,
    PaginationComponent,
    FormsModule,
    LoadingCardComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit, OnChanges {
  protected readonly registrations = signal<Registration[]>([]);
  protected registrationFilters = signal<TicketType[]>([]);
  public currentEventId = input<number | null>(null);
  protected searchTerm = signal<string>('');
  protected capacity = signal<number>(0);
  protected page = signal<number>(0);
  protected totalPage = signal<number>(0);
  protected currentTicketType = signal<string>('');
  protected loading = signal<boolean>(true);
  protected registrationsData = signal<Registrants[] | null>(null);

  // Add these new signals for pagination
  protected totalItems = signal<number>(0);
  protected itemsPerPage = signal<number>(10); // Adjust based on your API page size

  private debounceTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly manageEventService: ManageEventService) {}

  ngOnInit(): void {
    const eventId = this.currentEventId();
    if (eventId) {
      this.loadRegistrations(eventId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {}

  private loadRegistrations(id: number) {
    this.loading.set(true);
    this.manageEventService.registrationOverview(id).subscribe({
      next: (response) => {
        this.capacity.set(response.data.capacity);
        this.registrationFilters.set(response.data.ticketTypes);
        this.registrationsData.set(response.data.eventRegistrations.content);
        this.totalPage.set(response.data.eventRegistrations.totalPages);

        // Add these lines to calculate total items
        this.totalItems.set(
          response.data.eventRegistrations.totalElements || 0,
        );
        this.itemsPerPage.set(response.data.eventRegistrations.size || 10);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  private doSearch(id: number) {
    this.loading.set(true);
    this.manageEventService
      .searchRegistration(
        id,
        this.searchTerm(),
        this.currentTicketType(),
        this.page(),
      )
      .subscribe({
        next: (response) => {
          this.registrationsData.set(response.data.content);
          this.totalPage.set(response.data.totalPages);

          // Update pagination info after search
          this.totalItems.set(response.data.totalElements || 0);
          this.itemsPerPage.set(response.data.size || 10);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  private searchRegistrants() {
    const id = this.currentEventId();
    if (!id) return;

    if (this.debounceTimeoutId) {
      clearTimeout(this.debounceTimeoutId);
    }

    this.debounceTimeoutId = setTimeout(() => {
      this.doSearch(id);
    }, 300);
  }

  onSearch(text: string): void {
    this.searchTerm.set(text.toLowerCase());
    this.page.set(0);
    this.searchRegistrants();
  }

  onFilter(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.currentTicketType.set(selectElement.value);
    this.page.set(0);
    this.searchRegistrants();
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
    this.searchRegistrants();
  }
}