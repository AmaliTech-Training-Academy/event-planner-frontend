import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from "../../../../../shared/ui/button/button.component";
import { EVENT_TYPE, EVENT_FORM_FIELDS as FIELDS, MEETING_TYPE } from './../../../constants/event-form.constant';
import { APP_ROUTES } from '../../../../../core/constants/app-routes.constants';
import { CommonModule } from '@angular/common';
import { Form, FormGroup } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-event-options-container',
  imports: [ButtonComponent, CommonModule, RouterLink],
  templateUrl: './event-options-container.component.html',
  styleUrl: './event-options-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class EventOptionsContainerComponent {

  public form = input<FormGroup>()

  public checked = input<boolean>()

  public openPriceModal = output<void>();

  public openCapacityModal = output<void>();

  public requireApprovalChange = output<void>();



  protected onToggle() {
    this.requireApprovalChange.emit()
  }

  protected toggleCapacityModal() {
    this.openCapacityModal.emit()
  }

  protected togglePriceModal() {
    this.openPriceModal.emit()
  }

  protected get EVENT_FORM_FIELDS() {
    return FIELDS;
  }

  protected get MEETING_TYPES() {
    return MEETING_TYPE;
  }

  protected get EVENT_TYPES() {
    return EVENT_TYPE;
  }


  protected get APP_ROUTE() {
    return APP_ROUTES;
  }
}
