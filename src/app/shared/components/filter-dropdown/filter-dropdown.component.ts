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
  
 
  @Input() public selectedOption: string = ''; 
  
  @Output() public optionSelected = new EventEmitter<string>();

  
  public onOptionSelect(option: string): void {
    this.optionSelected.emit(option);
  }
}

