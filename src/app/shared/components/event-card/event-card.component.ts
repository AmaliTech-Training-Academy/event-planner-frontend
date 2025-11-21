import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../ui/button/button.component';
import { EventSummary } from '../../../core/models/event.model';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { MyEventItem } from '@app/core/models/myevent.model';
import { PLACEHOLDER_IMAGE } from '@app/core/constants/user.constants';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, ButtonComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  public event = input.required<EventSummary | MyEventItem>();
  public variant = input<'explore' | 'manage' | 'view-events'>('explore');
  public manageEvent = output<EventSummary>();


  protected readonly routes = APP_ROUTES;
  private readonly router = inject(Router);


  protected navigateToDetails(): void {
    const route = this.routes.EVENT_DETAILS(this.event().id.toString());
    this.router.navigate([route]);
  }


  protected onManageClick(): void {
    this.manageEvent.emit(this.event() as EventSummary);
  }

  protected handleImageFallback(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = PLACEHOLDER_IMAGE;
  }

}