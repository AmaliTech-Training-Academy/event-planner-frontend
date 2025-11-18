import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventTypeFilter } from '../../../core/models/event.model';

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './filter-dropdown.component.html',
  styleUrl: './filter-dropdown.component.scss'
})
export class FilterDropdownComponent {
  @Input() public options: EventTypeFilter[] = [];
  
 
  @Input() public selectedOption: EventTypeFilter|null = null; 
  
  @Output() public optionSelected = new EventEmitter<EventTypeFilter>();

  
  public onOptionSelect(option: EventTypeFilter): void {
    this.optionSelected.emit(option);
  }
}

