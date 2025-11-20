import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EventBackendServiceService } from '../../../../core/services/backend/event-backend-service.service';
import { TimePickerComponent } from "../../../../shared/components/time-picker/time-picker.component";
import { CreateEventDateComponent } from "../create-event-date/create-event-date.component";

@Component({
  selector: 'app-event-time-picker',
  imports: [CreateEventDateComponent, TimePickerComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './event-time-picker.component.html',
  styleUrl: './event-time-picker.component.scss'
})
export class EventTimePickerComponent implements OnInit {
  public readonly control = input<FormControl | undefined>(undefined);

  protected isOpen: boolean = false;
  protected selectedTime: string = "";
  protected readonly selectableTime: string[] = this.generateTimes()

  constructor(private readonly elementRef: ElementRef, private readonly backendService: EventBackendServiceService) { }

  ngOnInit(): void {
    const currentValue = this.control()?.value;
    if (currentValue) {
      this.selectedTime = this.selectableTime.find((time) => time === currentValue) || '';
    }
  }

  protected toggleState() {
    this.isOpen = !this.isOpen;
  }

  protected selectTime(time: string) {
    this.selectedTime = time;
    if (this.control()) {
      this.control()?.setValue(time);
      this.control()?.markAsDirty();
    }

    this.toggleState();
  }

  private generateTimes(intervalMinutes: number = 1): string[] {
    const times: string[] = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minute.toString().padStart(2, '0');
        times.push(`${hourStr}:${minuteStr}`);
      }
    }

    return times;
  }

  @HostListener('document:click', ['$event'])
  protected handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.isOpen && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }
}
