import { ChangeDetectionStrategy, Component, ElementRef, HostListener } from '@angular/core';
import { CreateEventDateComponent } from "../create-event-date/create-event-date.component";
import { DatePickerComponent } from "../../../../shared/components/date-picker/date-picker.component";

@Component({
  selector: 'app-event-date-picker',
  imports: [CreateEventDateComponent, DatePickerComponent],
  templateUrl: './event-date-picker.component.html',
  styleUrl: './event-date-picker.component.scss',
})
export class EventDatePickerComponent {
  protected isOpen: boolean = false;

 constructor(private readonly elementRef: ElementRef) {}

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
