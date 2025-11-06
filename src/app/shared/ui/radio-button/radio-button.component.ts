import { Component, input } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio-button',
  imports: [ReactiveFormsModule],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class RadioButtonComponent {
  public readonly label = input.required<string>();
  public readonly id = input.required<string>();
  public readonly value = input.required<any>();
  public readonly controlName = input.required<string>();
}
