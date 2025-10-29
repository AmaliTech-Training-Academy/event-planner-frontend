import { Component, output } from '@angular/core';
import { TIME_ZONES } from '../../../modules/attendee/data/timezones.data';

interface TimeZone {
  gmt: string,
  name: string
}

@Component({
  selector: 'app-time-zone-picker',
  imports: [],
  templateUrl: './time-zone-picker.component.html',
  styleUrl: './time-zone-picker.component.scss'
})
export class TimeZonePickerComponent {

public readonly timeZoneSelected = output<TimeZone>();

  // TODO: fetch time zones from backend
  protected readonly timeZones: readonly TimeZone[] = TIME_ZONES;


  protected selectTimeZone(timeZone: TimeZone) {
    this.timeZoneSelected.emit(timeZone);
  }

}