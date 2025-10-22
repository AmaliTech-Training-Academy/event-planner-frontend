import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateEventDateComponent } from "../create-event-date/create-event-date.component";
import { DatePickerComponent } from "../../../../shared/components/date-picker/date-picker.component";

@Component({
  selector: 'app-event-date-picker',
  imports: [CreateEventDateComponent, DatePickerComponent],
  templateUrl: './event-date-picker.component.html',
  styleUrl: './event-date-picker.component.scss',
})
export class EventDatePickerComponent {
  protected isOpen:boolean = false;


  protected toggleState(value:boolean){
    this.isOpen = value;
  }

}
