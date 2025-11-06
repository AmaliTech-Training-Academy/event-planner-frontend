import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  computed,
  forwardRef,
  effect,
  HostListener,
  ElementRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormErrorComponent } from '../../ui/form-error/form-error.component';
import { ButtonComponent } from "../../ui/button/button.component";

interface FilterOption {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-filter-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormErrorComponent, ButtonComponent],
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
  public readonly options = input<ReadonlyArray<FilterOption>>([]);
  public readonly placeholder = input<string>('All');
  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly errorMessage = input<string | null>(null);
  public readonly value = input<string>('');
  public readonly disabled = input<boolean>(false);
  public readonly showReset = input<boolean>(true);
  public readonly valueChange = output<string>();
  public readonly reset = output<void>();

  private readonly _value = signal<string>('');
  private readonly _isOpen = signal(false);
  private readonly _disabled = signal(false);
  private readonly _activeIndex = signal<number>(-1);

  public readonly isOpen = computed(() => this._isOpen());
  public readonly isDisabled = computed(
    () => this.disabled() || this._disabled()
  );
  public readonly selectedLabel = computed(() => {
    const selected = this.options()?.find((o) => o.value === this._value());
    return selected?.label ?? this.placeholder();
  });
  public readonly filterClass = computed(() => {
    const classes = [`filter-select--${this.size()}`];
    if (this.isDisabled()) {
      classes.push('filter-select--disabled');
    }
    return classes.join(' ');
  });
  public readonly hasValue = computed(() => {
    const val = this._value();
    return val !== '' && val !== 'all';
  });

  constructor(private elementRef: ElementRef) {
    effect(() => {
      const externalValue = this.value();
      if (externalValue && externalValue !== this._value()) {
        this._value.set(externalValue);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this._isOpen.set(false);
      this._activeIndex.set(-1);
    }
  }

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  public writeValue(value: string): void {
    this._value.set(value ?? '');
  }

  public registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  public toggleDropdown(): void {
    if (this.isDisabled()) return;
    this._isOpen.update((open) => !open);

    if (!this._isOpen()) {
      this._activeIndex.set(-1);
      this._onTouched();
    }
  }

  public selectOption(option: FilterOption): void {
    if (this.isDisabled()) return;

    this._value.set(option.value);
    this._onChange(option.value);
    this.valueChange.emit(option.value);
    this._isOpen.set(false);
    this._activeIndex.set(-1);
    this._onTouched();
  }

  public resetFilter(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;

    this._value.set('all');
    this._onChange('all');
    this.valueChange.emit('all');
    this.reset.emit();
    this._onTouched();
  }

  public onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

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

  public currentValue(): string {
    return this._value();
  }
}
