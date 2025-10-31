import { Component, output } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  imports: [],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class TimePickerComponent {

  public readonly selectTime = output<string>();

  protected readonly timeSlots: string[] = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "01:00",
    "01:30",
  ]

  protected timeSelected(time: string) {
    this.selectTime.emit(time);
  }

}
