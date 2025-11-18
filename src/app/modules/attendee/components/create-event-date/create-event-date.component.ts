import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from "../../../../shared/ui/button/button.component";

@Component({
  selector: 'app-create-event-date',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './create-event-date.component.html',
  styleUrl: './create-event-date.component.scss'
})
export class CreateEventDateComponent {

  protected currentValue: string = "";

  public readonly icon = input<string>('');
  public readonly title = input<string | undefined>('');
  public readonly clicked = output<void>();


  protected readonly selectedState = signal(false);

  protected clickedOn() {
    this.selectedState.update(v => !v);
    this.clicked.emit();
  }


}
