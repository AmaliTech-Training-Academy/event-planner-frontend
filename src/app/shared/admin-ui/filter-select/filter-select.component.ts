import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  computed,
} from '@angular/core';

interface FilterOption {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-filter-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSelectComponent {
  // ✅ Inputs
  public readonly options = input<ReadonlyArray<FilterOption>>([]);
  public readonly value = input<string>('all');
  public readonly placeholder = input<string>('All'); // ✅ Now declared as input

  // ✅ Outputs
  public readonly valueChange = output<string>();

  // ✅ Reactive state
  private readonly _isOpen = signal(false);

  public readonly isOpen = computed(() => this._isOpen());
  public readonly selectedLabel = computed(() => {
    const selected = this.options()?.find((o) => o.value === this.value());
    return selected?.label ?? this.placeholder();
  });

  // ✅ Methods
  public toggleDropdown(): void {
    this._isOpen.update((open) => !open);
  }

  public selectOption(option: FilterOption): void {
    this.valueChange.emit(option.value);
    this._isOpen.set(false);
  }
}
