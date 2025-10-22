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
  public readonly options = input<FilterOption[]>([]);
  public readonly value = input<string>('all');
  public readonly placeholder = input<string>('All');

  public readonly valueChange = output<string>();

  public readonly isOpen = signal(false);

  public toggleDropdown(): void {
    this.isOpen.update((v) => !v);
  }

  public selectOption(option: FilterOption): void {
    this.valueChange.emit(option.value);
    this.isOpen.set(false);
  }

  public get selectedLabel(): string {
    const selected = this.options().find((o) => o.value === this.value());
    return selected ? selected.label : this.placeholder();
  }
}
