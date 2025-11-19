import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTES } from '../../../../../../core/constants/app-routes.constants';
import { ModalContainerComponent } from "../../../../../../shared/components/modal-container/modal-container.component";
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";
import { InputComponent } from "../../../../../../shared/ui/input/input.component";
import { getControlError } from '../../../../../../shared/utils/form-error.util';
import { EVENT_TYPE, EVENT_FORM_FIELDS as FIELDS, MEETING_TYPE } from '../../../../constants/event-form.constant';

@Component({
  selector: 'app-set-capacity-modal',
  imports: [ModalContainerComponent, InputComponent, ButtonComponent,ReactiveFormsModule,NgOptimizedImage],
  templateUrl: './set-capacity-modal.component.html',
  styleUrl: './set-capacity-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class SetCapacityModalComponent {

  public close = output<void>()
  public removeCapacity = output<void>()
  public setCapacity = output<void>()
  public capacity = input<number>()

  protected readonly EVENT_FORM_FIELDS = FIELDS;
  protected readonly MEETING_TYPES = MEETING_TYPE;
  protected readonly EVENT_TYPES = EVENT_TYPE;
  protected readonly APP_ROUTE = APP_ROUTES;

  constructor(private readonly controlContainer: ControlContainer) {}

  protected getControl(path: string): AbstractControl | null {
    return this.controlContainer?.control?.get(path) || null;
  }

  protected readonly getError = getControlError;

  protected setCapacityLimit() {
    this.setCapacity.emit()

  }

  protected removeCapacityLimit() {
    this.removeCapacity.emit()
  }
  
  protected toggleCapacityModal() {
    this.close.emit()
  }

}
