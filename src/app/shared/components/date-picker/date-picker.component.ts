import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  public readonly dateSelected = output<Date>();
  public readonly minDate = input<Date | null>(null);
  private today = new Date();
  protected currentMonth = this.today.getMonth();
  protected currentYear = this.today.getFullYear();
  protected selectedDate: Date | null = null;

  protected get monthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'short' });
  }

  protected get daysInMonth(): number[] {
    const total = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  protected get firstDayOffset(): number {
    return new Date(this.currentYear, this.currentMonth, 0).getDay();
  }

  protected prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  protected nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  protected selectDate(day: number) {
    const date = new Date(this.currentYear, this.currentMonth, day);
    if (this.isPastDate(day)) return;
    this.selectedDate = date;
    this.dateSelected.emit(this.selectedDate);
  }

  protected isPastDate(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    const compareDate = this.minDate() || new Date();
    compareDate.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < compareDate;
  }

  protected selectToday() {
    this.selectedDate = new Date();
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();
    this.dateSelected.emit(this.selectedDate);
  }

  protected getSelectedDate():Date{
    const date_  = this.selectedDate ?  this.selectedDate :  new Date();
    return date_
  }

  protected selectLast() {
    if (this.selectedDate) this.dateSelected.emit(this.selectedDate);
  }
}
