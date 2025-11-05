import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card.component';
import { EventCard } from '../../../../core/models/event.model';
import { MOCK_EVENT_CARDS } from '../../../../core/data/mock-data';
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
    // We'll just use the mock data for now
    this.myEvents.set(MOCK_EVENT_CARDS);
  }

  /**
   * Handles the manage event click.
   * This is where you would navigate to your edit page.
   */
  protected handleManageEvent(event: EventCard): void {
    console.log('Managing event from the page:', event.id);
    // Example navigation (uncomment when your MANAGE_EVENT route exists):
    // this.router.navigate([this.routes.MANAGE_EVENT, event.id]);
  }
}

