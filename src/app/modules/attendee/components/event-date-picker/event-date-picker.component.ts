import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent } from "../../../../shared/components/date-picker/date-picker.component";
import { CreateEventDateComponent } from "../create-event-date/create-event-date.component";

@Component({
  selector: 'app-event-date-picker',
  imports: [CreateEventDateComponent, DatePickerComponent,ReactiveFormsModule],
  templateUrl: './event-date-picker.component.html',
  styleUrl: './event-date-picker.component.scss',
})
export class EventDatePickerComponent {
  protected isOpen: boolean = false;
  @Input({ required: true }) control!: FormControl;


 constructor(private readonly elementRef: ElementRef) {}

  protected toggleState() {
    this.isOpen = !this.isOpen;
  }

  protected selectedDate(date:Date){
      console.log("selected Date",date)
  }

  @HostListener('document:click', ['$event'])
  protected handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.isOpen && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }

}
