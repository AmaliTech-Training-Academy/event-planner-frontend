import { Component } from '@angular/core';
import { CreateEventDateComponent } from "../create-event-date/create-event-date.component";
import { DatePickerComponent } from "../../../../shared/components/date-picker/date-picker.component";
import { TimePickerComponent } from "../../../../shared/components/time-picker/time-picker.component";

@Component({
  selector: 'app-event-time-picker',
  imports: [CreateEventDateComponent, TimePickerComponent],
  templateUrl: './event-time-picker.component.html',
  styleUrl: './event-time-picker.component.scss'
})
export class EventTimePickerComponent {
  protected isOpen: boolean = false;


  protected toggleState(value: boolean) {
    this.isOpen = value;
  }
}
