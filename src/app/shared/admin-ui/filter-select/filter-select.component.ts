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
  public readonly options = input<ReadonlyArray<FilterOption>>([]);
  public readonly value = input<string>('all');
  public readonly placeholder = input<string>('All');

  public readonly valueChange = output<string>();

  private readonly _isOpen = signal(false);
  public readonly isOpen = computed(() => this._isOpen());

  private readonly _activeIndex = signal<number>(-1); // keyboard navigation
  public readonly selectedLabel = computed(() => {
    const selected = this.options()?.find((o) => o.value === this.value());
    return selected?.label ?? this.placeholder();
  });

  public toggleDropdown(): void {
    this._isOpen.update((open) => !open);
    if (!this._isOpen()) {
      this._activeIndex.set(-1); // reset keyboard navigation
    }
  }

  public selectOption(option: FilterOption): void {
    this.valueChange.emit(option.value);
    this._isOpen.set(false);
    this._activeIndex.set(-1);
  }

  public onKeydown(event: KeyboardEvent): void {
    if (!this._isOpen()) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggleDropdown();
      }
      return;
    }

    const optionsLength = this.options()?.length ?? 0;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this._activeIndex.update((i) => (i + 1) % optionsLength);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this._activeIndex.update(
          (i) => (i - 1 + optionsLength) % optionsLength
        );
        break;
      case 'Enter':
        event.preventDefault();
        const currentOption = this.options()?.[this._activeIndex()] ?? null;
        if (currentOption) this.selectOption(currentOption);
        break;
      case 'Escape':
        event.preventDefault();
        this._isOpen.set(false);
        this._activeIndex.set(-1);
        break;
    }
  }

  public isActive(index: number): boolean {
    return this._activeIndex() === index;
  }
}
