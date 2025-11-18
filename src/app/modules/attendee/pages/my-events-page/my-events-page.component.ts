import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MY_EVENT_STAT_CARDS } from '@app/core/constants/myevents.constant';
import { MyEventItem } from '@app/core/models/myevent.model';
import { EventsServiceService } from '@app/core/services/events.service';
import { PaginationComponent } from '@app/shared/admin-ui/pagination/pagination.component';
import { EmptyListMessageComponent } from '@app/shared/components/empty-list-message/empty-list-message.component';
import { Subject, takeUntil } from 'rxjs';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { UserCardData } from '../../../../core/models';
import { EventCard } from '../../../../core/models/events';
import { AdminUserCardComponent } from '../../../../shared/admin-ui/admin-user-card/admin-user-card.component';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LineChartComponent } from '../../../admin/pages/dashboard-page/components/line-chart/line-chart.component';

@Component({
  selector: 'app-my-events-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EventCardComponent,
    AdminUserCardComponent,
    LineChartComponent,
    ButtonComponent,
    PaginationComponent,
    ButtonComponent,
    EmptyListMessageComponent
  ],
  templateUrl: './my-events-page.component.html',
  styleUrl: './my-events-page.component.scss',
})
export class MyEventsPageComponent implements OnInit, OnDestroy {
  protected readonly routes = APP_ROUTES;
  protected myEvents = signal<MyEventItem[]>([]);
  protected page = signal<number>(0);
  protected totalaPages = signal<number>(0);
  protected loading = signal<boolean>(true);
  protected statCards = signal<UserCardData[]>(MY_EVENT_STAT_CARDS);
  private destroy$ = new Subject<void>();

  constructor(private readonly router: Router, private readonly eventService: EventsServiceService) { }


  ngOnInit(): void {

    this.eventService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (loading_) => {
          this.loading.set(loading_)
        }
      })

    this.eventService.myEvents(this.page())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.myEvents.set(response.data.content);
          this.totalaPages.set(response.data.totalPages)
        }
      })

    this.eventService.myEventOverview()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.statCards.update(prev => {
            const updated = [...prev];

            Object.entries(response.data).forEach(([key, value]) => {
              const card = updated.find(c => c.backend_key === key);
              if (card) {
                card.count = value;
              }
            });

            return updated;
          });

        }
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected handleManageEvent(event: EventCard): void {
    this.router.navigate([this.routes.MANAGE_EVENT_ROLES, event.id]);
  }

  protected onManageEvent(): void {
    this.router.navigate([this.routes.MANAGE_EVENT]);
  }

  protected navigateToCreateEvent() {
    this.router.navigate([APP_ROUTES.CREATE_EVENT])
  }
  protected navigateToExploreEvent() {
    this.router.navigate([APP_ROUTES.EXPLORE])
  }
}
