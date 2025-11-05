import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {
 
  @Input() public placeholder: string = 'Search...';
  @Input() public iconPath: string = '';

  
  private _value: string = '';
  @Input()
  public get value(): string {
    return this._value;
  }
  public set value(val: string) {
    if (val !== this._value) {
      this._value = val;
      this.valueChange.emit(this._value);
    }
  }
  @Output() public valueChange = new EventEmitter<string>();

  
  public onValueChange(newValue: string): void {
    this.value = newValue; 
  }
}
