import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';

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
  public options = input<FilterOption[]>([]);
  public value = input<string>('all');
  public placeholder = input<string>('All');
  public valueChange = output<string>();

  public isOpen = signal(false);

  toggleDropdown(): void {
    this.isOpen.update((v) => !v);
  }

  selectOption(option: FilterOption): void {
    this.valueChange.emit(option.value);
    this.isOpen.set(false);
  }

  // ✅ Safe getter for the currently selected label
  get selectedLabel(): string {
    const selected = this.options().find((o) => o.value === this.value());
    return selected ? selected.label : this.placeholder();
  }
}
