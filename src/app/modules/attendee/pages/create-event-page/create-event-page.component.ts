import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EventDatePickerComponent } from "../../components/event-date-picker/event-date-picker.component";
import { EventTimePickerComponent } from "../../components/event-time-picker/event-time-picker.component";
import { EventTimeZonePickerComponent } from "../../components/event-time-zone-picker/event-time-zone-picker.component";

@Component({
  selector: 'app-create-event-page',
  imports: [CommonModule, EventDatePickerComponent, EventTimePickerComponent, EventTimeZonePickerComponent],
  templateUrl: './create-event-page.component.html',
  styleUrl: './create-event-page.component.scss'
})
export class CreateEventPageComponent {
  checked: boolean = false;
  
  onToggle() {

  }

}
