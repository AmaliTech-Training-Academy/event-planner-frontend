import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  imports: [],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class TimePickerComponent {

  public readonly selectTime = output<string>();
  public readonly timeSlots = input<string[]>([])

  protected timeSelected(time: string) {
    this.selectTime.emit(time);
  }

}
