import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTES } from '../../../../../core/constants/app-routes.constants';
import { ModalContainerComponent } from "../../../../../shared/components/modal-container/modal-container.component";
import { ButtonComponent } from "../../../../../shared/ui/button/button.component";
import { InputComponent } from "../../../../../shared/ui/input/input.component";
import { RadioButtonComponent } from "../../../../../shared/ui/radio-button/radio-button.component";
import { EVENT_TYPE, EVENT_FORM_FIELDS as FIELDS, MEETING_TYPE } from './../../../constants/event-form.constant';

@Component({
  selector: 'app-set-price-modal',
  imports: [ModalContainerComponent, RadioButtonComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './set-price-modal.component.html',
  styleUrl: './set-price-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class SetPriceModalComponent {

  public onSetPrice = output<void>()
  public closeModal = output<void>()

  protected togglePriceModal() {
    this.closeModal.emit()
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

  protected setPrice() {
    this.onSetPrice.emit()
  }
}
