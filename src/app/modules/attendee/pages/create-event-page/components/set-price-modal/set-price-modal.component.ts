import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTES } from '../../../../../../core/constants/app-routes.constants';
import { ModalContainerComponent } from "../../../../../../shared/components/modal-container/modal-container.component";
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";
import { InputComponent } from "../../../../../../shared/ui/input/input.component";
import { RadioButtonComponent } from "../../../../../../shared/ui/radio-button/radio-button.component";
import { EVENT_TYPE, EVENT_FORM_FIELDS as FIELDS, MEETING_TYPE } from '../../../../constants/event-form.constant';
import { NgOptimizedImage } from '@angular/common';
import { FormErrorComponent } from '../../../../../../shared/ui/form-error/form-error.component';
import { getControlError } from '../../../../../../shared/utils/form-error.util';

@Component({
  selector: 'app-set-price-modal',
  imports: [ModalContainerComponent, RadioButtonComponent, InputComponent, ButtonComponent, ReactiveFormsModule, NgOptimizedImage, FormErrorComponent],
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
  public price = input<number>()

  protected togglePriceModal() {
    this.closeModal.emit()
  }

  protected readonly EVENT_FORM_FIELDS = FIELDS;
  protected readonly MEETING_TYPES = MEETING_TYPE;
  protected readonly EVENT_TYPES = EVENT_TYPE;
  protected readonly APP_ROUTE = APP_ROUTES;

  protected setPrice() {
    this.onSetPrice.emit()
  }

  constructor(private readonly controlContainer: ControlContainer) {}

  protected getControl(path: string): AbstractControl | null {
    return this.controlContainer?.control?.get(path) || null;
  }

  protected readonly getError = getControlError;
}
