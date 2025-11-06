import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { GooglePlacesLoaderService } from '../../../core/services/google-places-loader.service';

declare const google: any;

@Component({
  selector: 'app-location-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './location-search.component.html',
  styleUrl: './location-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationSearchComponent),
      multi: true,
    },
  ],
})
export class LocationSearchComponent implements  ControlValueAccessor, AfterViewInit {
  public readonly placeholder = input<string>('Search for a location');
  public readonly label = input<string>('Location');
  public readonly iconSrc = input<string>('icons/pin.svg');

  public readonly placeSelected = output<any>();

  private readonly _value = signal<string>('');
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  public disabled = true;
  
  @ViewChild('inputRef', { static: true }) inputRef!: ElementRef<HTMLInputElement>;

  constructor(private readonly placesLoader: GooglePlacesLoaderService) {}

  public async ngAfterViewInit(): Promise<void> {
    await this.placesLoader.load();
    if (!this.inputRef?.nativeElement || typeof google === 'undefined') return;
    const autocomplete = new google.maps.places.Autocomplete(this.inputRef.nativeElement, {
      fields: ['formatted_address', 'geometry', 'name', 'place_id'],
      types: ['geocode'],
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.handleAddressChange(place);
    });
  }

  public writeValue(value: string): void {
    this._value.set(value || '');
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public currentValue(): string {
    return this._value();
  }

  public onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this._value.set(value);
    this.onChange(value);
  }

  public onBlur(): void {
    this.onTouched();
  }

  public handleAddressChange(place: any) {
    const formatted = place?.formatted_address || place?.name || '';
    this._value.set(formatted);
    this.onChange(formatted);
    this.placeSelected.emit(place);
  }
}


