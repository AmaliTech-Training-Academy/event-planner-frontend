import { Component, ElementRef, HostListener, input, OnInit } from '@angular/core';
import { CreateEventDateComponent } from "../create-event-date/create-event-date.component";
import { TimeZonePickerComponent } from "../../../../shared/components/time-zone-picker/time-zone-picker.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EventsServiceService } from '../../../../core/services/events.service';
import { TimeZone } from '../../../../core/models/event.model';

@Component({
  selector: 'app-event-time-zone-picker',
  imports: [CreateEventDateComponent, TimeZonePickerComponent, ReactiveFormsModule],
  templateUrl: './event-time-zone-picker.component.html',
  styleUrl: './event-time-zone-picker.component.scss'
})
export class EventTimeZonePickerComponent implements OnInit {

  public readonly control = input<FormControl | undefined>(undefined);

  protected selectedTimeZone: TimeZone | null = null
  protected timeZones: TimeZone[] = []
  protected isOpen: boolean = false;

  constructor(private readonly elementRef: ElementRef, private readonly eventService: EventsServiceService) { }

  ngOnInit(): void {
    this.eventService.timeZones().subscribe({
      next: (value) => {
        this.timeZones = value;
        const currentValue = this.control()?.value;
        if (currentValue) {
          this.selectedTimeZone =
            this.timeZones.find((tz) => tz.zoneId === currentValue) || null;
        }
      }
    })
  }

  protected toggleState() {
    this.isOpen = !this.isOpen;
  }

  protected selectTimeZone(timeZone: TimeZone) {

    this.selectedTimeZone = timeZone;

    if (this.control()) {
      this.control()?.setValue(timeZone.zoneId);
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
