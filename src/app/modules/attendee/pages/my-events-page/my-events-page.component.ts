import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MY_EVENT_STAT_CARDS } from '@app/core/constants/myevents.constant';
import { MyEventItem } from '@app/core/models/myevent.model';
import { EventsServiceService } from '@app/core/services/events.service';
import { PaginationComponent } from '@app/shared/admin-ui/pagination/pagination.component';
import { EmptyListMessageComponent } from '@app/shared/components/empty-list-message/empty-list-message.component';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { UserCardData } from '../../../../core/models';
import { EventCard } from '../../../../core/models/events';
import { AdminUserCardComponent } from '../../../../shared/admin-ui/admin-user-card/admin-user-card.component';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LoadingCardComponent } from '@app/shared/components/loading-card/loading-card.component';

@Component({
  selector: 'app-my-events-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EventCardComponent,
    AdminUserCardComponent,
    ButtonComponent,
    PaginationComponent,
    ButtonComponent,
    EmptyListMessageComponent,
    LoadingCardComponent,
  ],
  templateUrl: './my-events-page.component.html',
  styleUrl: './my-events-page.component.scss',
})
export class MyEventsPageComponent implements OnInit, OnDestroy {
  protected readonly routes = APP_ROUTES;
  protected myEvents = signal<MyEventItem[]>([]);
  protected currentPage = signal<number>(1); 
  protected totalItems = signal<number>(0); 
  protected itemsPerPage = signal<number>(10);
  protected loading = signal<boolean>(true);
  protected statCards = signal<UserCardData[]>(MY_EVENT_STAT_CARDS);
  private destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly eventService: EventsServiceService
  ) {}

  ngOnInit(): void {
    this.eventService.loading$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (loading_) => {
        this.loading.set(loading_);
      },
    });

    this.getMyEvents();

    forkJoin({
      events: this.eventService.myEvents(this.currentPage() - 1), 
      overview: this.eventService.myEventOverview(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ events, overview }) => {
          this.myEvents.set(events.data.content);
          this.totalItems.set(events.data.totalElements);

          this.statCards.update((prev) => {
            const updated = [...prev];
            Object.entries(overview.data).forEach(([key, value]) => {
              const card = updated.find((c) => c.backend_key === key);
              if (card) {
                card.count = value;
              }
            });
            return updated;
          });
        },
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getMyEvents() {
    this.eventService
      .myEvents(this.currentPage() - 1) 
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.myEvents.set(response.data.content);
          this.totalItems.set(response.data.totalElements); 
        },
      });
  }

  protected handleManageEvent(event: EventCard): void {
    this.router.navigate([this.routes.MANAGE_EVENT_ROLES, event.id]);
  }

  protected onManageEvent(id: string): void {
    this.router.navigate([this.routes.MANAGE_EVENT(id)]);
  }

  protected navigateToCreateEvent() {
    this.router.navigate([APP_ROUTES.CREATE_EVENT]);
  }

  protected navigateToExploreEvent() {
    this.router.navigate([APP_ROUTES.EXPLORE]);
  }

  protected setCurrentPage(pageNumber: number): void {
    this.currentPage.set(pageNumber);
    this.getMyEvents();
  }
}