import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { AdminUserCardComponent } from '../../../../shared/admin-ui/admin-user-card/admin-user-card.component';
import { LineChartComponent } from '../../../admin/pages/dashboard-page/components/line-chart/line-chart.component';
import { EventCard } from '../../../../core/models/event.model';
import { UserCardData } from '../../../../core/models/user.model';
import { LineSeriesConfig } from '../../../../core/models/chart.model';
import {ButtonComponent} from "../../../../shared/ui/button/button.component";

import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';

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
    
  }

  protected onManageEvent(event: EventCard): void {
    
  }

  protected onViewEvent(event: EventCard): void {
    this.router.navigate([this.routes.EVENT_DETAILS, event.id]);
  }
}