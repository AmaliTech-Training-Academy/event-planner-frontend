import { Component } from '@angular/core';
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { EventResponse } from '../../../../core/models/event.model';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';

@Component({
  selector: 'app-create-event-success',
  imports: [ButtonComponent, NgOptimizedImage],
  templateUrl: './create-event-success.component.html',
  styleUrl: './create-event-success.component.scss'
})
export class CreateEventSuccessComponent {

  protected createdEvent: EventResponse|null = null; 

  constructor(private router: Router) {

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { eventResponse: EventResponse }; 

    if (state) {
      this.createdEvent = state.eventResponse;
    }
  }

  ngOnInit(): void {
    if (!this.createdEvent) {
      this.router.navigate([APP_ROUTES.CREATE_EVENT]);
    }
  }

}
