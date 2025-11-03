import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { AppEvent } from '../../../core/models/event-model';
import { CommonModule, NgOptimizedImage} from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ButtonComponent],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCardComponent {
 @Input({ required: true }) event!: AppEvent;
  public APP_ROUTES = APP_ROUTES;

  constructor(private router: Router) {}

  public navigateToDetails(): void {
    this.router.navigate([ this.APP_ROUTES.EVENT_DETAILS( this.event.id)]);
  }
}

