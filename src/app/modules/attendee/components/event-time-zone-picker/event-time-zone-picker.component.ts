import { Component, ElementRef, HostListener, input } from '@angular/core';
import { CreateEventDateComponent } from "../create-event-date/create-event-date.component";
import { TimeZonePickerComponent } from "../../../../shared/components/time-zone-picker/time-zone-picker.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TimeZone } from '../../models/event.models';

@Component({
  selector: 'app-event-time-zone-picker',
  imports: [CreateEventDateComponent, TimeZonePickerComponent, ReactiveFormsModule],
  templateUrl: './event-time-zone-picker.component.html',
  styleUrl: './event-time-zone-picker.component.scss'
})
export class EventTimeZonePickerComponent {
  public readonly control = input<FormControl | undefined>(undefined);
  protected selectedTimeZone: TimeZone | null = null
  protected isOpen: boolean = false;

  constructor(private readonly elementRef: ElementRef) { }

  protected toggleState() {
    this.isOpen = !this.isOpen;
  }

  protected selectTimeZone(timeZone: TimeZone) {

    this.selectedTimeZone = timeZone;

    if (this.control()) {
      this.control()?.setValue(timeZone.gmt);
      this.control()?.markAsDirty();
    }

    this.toggleState()

  }

  @HostListener('document:click', ['$event'])
  protected handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.isOpen && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }
}
