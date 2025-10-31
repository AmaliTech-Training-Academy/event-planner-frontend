import {
  CommonModule,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  computed,
  forwardRef,
  effect,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormErrorComponent } from '../../ui/form-error/form-error.component';

interface FilterOption {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-filter-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterSelectComponent),
      multi: true,
    },
  ],
})
export class FilterSelectComponent implements ControlValueAccessor {
  /** --- Inputs --- */
  public readonly options = input<ReadonlyArray<FilterOption>>([]);
  public readonly placeholder = input<string>('All');
  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly errorMessage = input<string | null>(null);
  public readonly value = input<string>(''); // ✅ Add this input for [value] binding

  /** --- Outputs --- */
  public readonly valueChange = output<string>();

  /** --- Internal State --- */
  private readonly _value = signal<string>(''); // internal reactive value
  private readonly _isOpen = signal(false);
  private readonly _disabled = signal(false);
  private readonly _activeIndex = signal<number>(-1);

  /** --- Computed --- */
  public readonly isOpen = computed(() => this._isOpen());
  public readonly selectedLabel = computed(() => {
    const selected = this.options()?.find((o) => o.value === this._value());
    return selected?.label ?? this.placeholder();
  });
  public readonly filterClass = computed(() => `filter-select--${this.size()}`);

  constructor() {
    // ✅ Sync external [value] input with internal _value signal
    effect(() => {
      const externalValue = this.value();
      if (externalValue && externalValue !== this._value()) {
        this._value.set(externalValue);
      }
    });
  }

  /** --- ControlValueAccessor --- */
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this._value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  /** --- Public Methods --- */
  public toggleDropdown(): void {
    if (this._disabled()) return;
    this._isOpen.update((open) => !open);

    if (!this._isOpen()) {
      this._activeIndex.set(-1);
      this.onTouched();
    }
  }

  public selectOption(option: FilterOption): void {
    if (this._disabled()) return;

    this._value.set(option.value);
    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this._isOpen.set(false);
    this._activeIndex.set(-1);
    this.onTouched();
  }

  public onKeydown(event: KeyboardEvent): void {
    if (this._disabled()) return;

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
        const currentOption = this.options()?.[this._activeIndex()];
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

  /** --- Public getter for templates --- */
  public currentValue(): string {
    return this._value();
  }
}
