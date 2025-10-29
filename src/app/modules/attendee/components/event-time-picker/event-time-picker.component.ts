import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, input, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TimePickerComponent } from "../../../../shared/components/time-picker/time-picker.component";
import { CreateEventDateComponent } from "../create-event-date/create-event-date.component";

@Component({
  selector: 'app-event-time-picker',
  imports: [CreateEventDateComponent, TimePickerComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './event-time-picker.component.html',
  styleUrl: './event-time-picker.component.scss'
})
export class EventTimePickerComponent {
  public readonly control = input<FormControl | undefined>(undefined);

  protected isOpen: boolean = false;
  protected selectedTime: string = "";

  constructor(private readonly elementRef: ElementRef) { }

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

  @HostListener('document:click', ['$event'])
  protected handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.isOpen && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }
}
