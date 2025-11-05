import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';

@Component({
  selector: 'app-event-management-page',
  imports: [],
  templateUrl: './event-management-page.component.html',
  styleUrl: './event-management-page.component.scss',
})
export class EventManagementPageComponent {
  private readonly _layoutService = inject(LayoutService);
  constructor() {
    this._layoutService.pageTitle.set('Event Management');
  }
}
