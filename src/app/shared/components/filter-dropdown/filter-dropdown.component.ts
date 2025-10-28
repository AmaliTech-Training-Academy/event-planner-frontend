import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './filter-dropdown.component.html',
  styleUrl: './filter-dropdown.component.scss'
})
export class FilterDropdownComponent {
  @Input() public options: string[] = [];
  
  // --- FIX 1: Rename 'selected' to 'selectedOption' ---
  @Input() public selectedOption: string = ''; 
  
  @Output() public optionSelected = new EventEmitter<string>();

  // --- FIX 2: Add the missing method ---
  public onOptionSelect(option: string): void {
    this.optionSelected.emit(option);
  }
}

