import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-event-filter',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './event-filter.component.html',
  styleUrl: './event-filter.component.scss'
})
export {
  // --- Outputs are part of the public API ---
  @Output() public locationChange = new EventEmitter<string>();
  @Output() public eventTypeChange = new EventEmitter<string>();
  @Output() public dateChange = new EventEmitter<Date>();

  
  // --- Template-bound properties must be public ---
  public selectedLocation: string = '';
  public selectedEventType: string = 'all';
  public selectedDate: Date | null = null;

  
  // --- Template-called methods must be public ---
  public onLocationChange(): void {
    this.locationChange.emit(this.selectedLocation);
  }

  public onEventTypeChange(): void {
    this.eventTypeChange.emit(this.selectedEventType);
  }

  public onDateChange(): void {
    if (this.selectedDate) {
      this.dateChange.emit(this.selectedDate);
    }
  }
}
