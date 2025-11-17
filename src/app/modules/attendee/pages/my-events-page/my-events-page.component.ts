import {
  Component,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { MOCK_MY_EVENTS_CARDS } from '../../../../core/data/mock-data';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { EventCard } from '../../../../core/models/events';

@Component({
  selector: 'app-my-events-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EventCardComponent,
    AdminUserCardComponent,
    LineChartComponent,
    ButtonComponent
  ],
  templateUrl: './my-events-page.component.html',
  styleUrl: './my-events-page.component.scss',
})
export class MyEventsPageComponent implements OnInit {
  private readonly router = inject(Router);
  protected readonly routes = APP_ROUTES;

  // TODO: Replace with API call to fetch user's events
  protected myEvents = signal<EventCard[]>([]);
  
  // TODO: Replace with API call to fetch user's stats
  protected statCards = signal<UserCardData[]>([]);
  
  // TODO: Replace with API call to fetch user's chart data
  protected chartSeries = signal<LineSeriesConfig[]>([]);
  
  public ngOnInit(): void {
    this.myEvents.set(MOCK_MY_EVENTS_CARDS);
  }

  protected handleManageEvent(event: EventCard): void {
    this.router.navigate([this.routes.MANAGE_EVENT_ROLES, event.id]);
  }
}
