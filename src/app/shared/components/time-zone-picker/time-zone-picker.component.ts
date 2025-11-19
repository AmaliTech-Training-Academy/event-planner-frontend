import { Component, input, OnInit, output } from '@angular/core';
import { TimeZone } from '../../../core/models/event.model';
import { EventsServiceService } from '../../../core/services/events.service';



@Component({
  selector: 'app-time-zone-picker',
  imports: [],
  templateUrl: './time-zone-picker.component.html',
  styleUrl: './time-zone-picker.component.scss'
})
export class TimeZonePickerComponent {
  public readonly timeZoneSelected = output<TimeZone>();
  public readonly timeZones = input<TimeZone[]>([]);

  
  protected selectTimeZone(timeZone: TimeZone) {
    this.timeZoneSelected.emit(timeZone);
  }

}