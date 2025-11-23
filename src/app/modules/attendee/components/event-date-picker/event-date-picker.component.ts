import { Component, ElementRef, HostListener, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent } from "../../../../shared/components/date-picker/date-picker.component";
import { CreateEventDateComponent } from "../create-event-date/create-event-date.component";

@Component({
  selector: 'app-event-date-picker',
  imports: [CreateEventDateComponent, DatePickerComponent, ReactiveFormsModule],
  templateUrl: './event-date-picker.component.html',
  styleUrl: './event-date-picker.component.scss',
})
export class EventDatePickerComponent implements OnInit {

  public readonly control = input<FormControl | undefined>(undefined);
  protected isOpen: boolean = false;
  protected currentSelectedDate: Date | null = null;

  constructor(private readonly elementRef: ElementRef) { }


  ngOnInit(): void {
    const currentValue = this.control()?.value
    if (currentValue) {
      this.currentSelectedDate = currentValue as Date;
    }
  }

  protected toggleState() {
    this.isOpen = !this.isOpen;
  }

  protected selectedDate(date: Date) {
    this.currentSelectedDate = date;


    if (this.control()) {
      this.control()?.setValue(date);
      this.control()?.markAsDirty();
    }

    this.isOpen = false;
  }

  protected get parseSelectedDate(): string {
    if (!this.currentSelectedDate) return "Date";
    const day = String(this.currentSelectedDate.getDate()).padStart(2, '0');
    const month = String(this.currentSelectedDate.getMonth() + 1).padStart(2, '0');
    const year = this.currentSelectedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  @HostListener('document:click', ['$event'])
  protected handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.isOpen && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }

}
