import { Component } from '@angular/core';
import { CreateEventDateComponent } from "../create-event-date/create-event-date.component";
import { TimeZonePickerComponent } from "../../../../shared/components/time-zone-picker/time-zone-picker.component";

@Component({
  selector: 'app-event-time-zone-picker',
  imports: [CreateEventDateComponent, TimeZonePickerComponent],
  templateUrl: './event-time-zone-picker.component.html',
  styleUrl: './event-time-zone-picker.component.scss'
})
export class EventTimeZonePickerComponent {
  protected isOpen: boolean = false;

  

  protected toggleState(value: boolean) {
    this.isOpen = value;
  }
}
