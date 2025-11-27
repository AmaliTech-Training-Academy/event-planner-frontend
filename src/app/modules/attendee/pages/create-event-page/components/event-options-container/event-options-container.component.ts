import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { APP_ROUTES } from '../../../../../../core/constants/app-routes.constants';
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";
import { EVENT_TYPE, EVENT_FORM_FIELDS as FIELDS, MEETING_TYPE } from '../../../../constants/event-form.constant';

@Component({
  selector: 'app-event-options-container',
  imports: [ButtonComponent, CommonModule, NgOptimizedImage],
  templateUrl: './event-options-container.component.html',
  styleUrl: './event-options-container.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EventOptionsContainerComponent {

  public readonly form = input<FormGroup>()

  public readonly  checked = input<boolean>()

  public openPriceModal = output<void>();

  public openCapacityModal = output<void>();

  public requireApprovalChange = output<void>();


  protected readonly EVENT_FORM_FIELDS = FIELDS;
  protected readonly MEETING_TYPES = MEETING_TYPE;
  protected readonly EVENT_TYPES = EVENT_TYPE;
  protected readonly APP_ROUTE = APP_ROUTES;


  protected onToggle() {
    this.requireApprovalChange.emit()
  }

  protected toggleCapacityModal() {
    this.openCapacityModal.emit()
  }

  protected togglePriceModal() {
    this.openPriceModal.emit()
  }

}
