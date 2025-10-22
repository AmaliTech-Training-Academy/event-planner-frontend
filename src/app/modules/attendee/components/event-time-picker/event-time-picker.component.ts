import { Component, ElementRef, HostListener } from '@angular/core';
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

  constructor(private readonly elementRef: ElementRef) { }

  protected toggleState() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  protected handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.isOpen && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }
}
