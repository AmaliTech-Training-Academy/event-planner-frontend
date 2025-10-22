import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  @Output() dateSelected = new EventEmitter<Date>();

  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  selectedDate: Date | null = null;

  get monthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'short' });
  }

  get daysInMonth(): number[] {
    const total = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  get firstDayOffset(): number {
    return new Date(this.currentYear, this.currentMonth, 1).getDay();
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  selectDate(day: number) {
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
    this.dateSelected.emit(this.selectedDate);
  }

  selectToday() {
    this.selectedDate = new Date();
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();
    this.dateSelected.emit(this.selectedDate);
  }

  selectLast() {
    if (this.selectedDate) this.dateSelected.emit(this.selectedDate);
  }
}
