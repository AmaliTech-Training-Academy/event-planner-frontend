import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-filter-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss'],
})
export class FilterSelectComponent {
  public label = input<string>('');
  public options = input<FilterOption[]>([]);
  public value = input<string>('all');
  public valueChange = output<string>();

  public onChange(event: Event) {
    const newValue = (event.target as HTMLSelectElement).value;
    this.valueChange.emit(newValue);
  }
}
