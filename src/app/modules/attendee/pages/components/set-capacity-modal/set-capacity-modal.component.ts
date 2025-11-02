import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ModalContainerComponent } from "../../../../../shared/components/modal-container/modal-container.component";
import { InputComponent } from "../../../../../shared/ui/input/input.component";
import { ButtonComponent } from "../../../../../shared/ui/button/button.component";
import { EVENT_TYPE, EVENT_FORM_FIELDS as FIELDS, MEETING_TYPE } from './../../../constants/event-form.constant';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-set-capacity-modal',
  imports: [ModalContainerComponent, InputComponent, ButtonComponent,ReactiveFormsModule],
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


  protected get EVENT_FORM_FIELDS() {
    return FIELDS;
  }

  protected get MEETING_TYPES() {
    return MEETING_TYPE;
  }

  protected get EVENT_TYPES() {
    return EVENT_TYPE;
  }

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
