import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { CreateEventDateComponent } from "../create-event-date/create-event-date.component";
import { TimeZonePickerComponent } from "../../../../shared/components/time-zone-picker/time-zone-picker.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-time-zone-picker',
  imports: [CreateEventDateComponent, TimeZonePickerComponent,ReactiveFormsModule],
  templateUrl: './event-time-zone-picker.component.html',
  styleUrl: './event-time-zone-picker.component.scss'
})
export class EventTimeZonePickerComponent {
  protected isOpen: boolean = false;
  @Input({ required: true }) control!: FormControl;
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
