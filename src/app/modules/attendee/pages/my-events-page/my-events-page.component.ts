import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { UserCardData } from '../../../../core/models';
import { LineSeriesConfig } from '../../../../core/models/chart.model';
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
    LineChartComponent
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
    this.myEvents.set([]);
  }

  protected handleManageEvent(event: EventCard): void {
    this.router.navigate([this.routes.MANAGE_EVENT_ROLES, event.id]);
  }

  protected onManageEvent(): void {
   this.router.navigate([this.routes.MANAGE_EVENT]);
  }
}
