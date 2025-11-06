import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { EventCard } from '../../../../core/models/event.model';
import { MOCK_MY_EVENTS_CARDS } from '../../../../core/data/mock-data'; 
import { Router } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';

@Component({
  selector: 'app-my-events-page',
  standalone: true,
  imports: [CommonModule, RouterModule, EventCardComponent],
  templateUrl: './my-events-page.component.html',
  styleUrl: './my-events-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyEventsPageComponent implements OnInit {
  public myEvents = signal<EventCard[]>([]);
  private readonly router = inject(Router);
  protected readonly routes = APP_ROUTES;

  public ngOnInit(): void {
    this.myEvents.set(MOCK_MY_EVENTS_CARDS); 
  }

  protected handleManageEvent(event: EventCard): void {
  this.router.navigate([this.routes.MANAGE_EVENT_ROLES, event.id]);
  }
}