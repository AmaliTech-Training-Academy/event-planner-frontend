import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-switch',
  imports: [CommonModule, FormsModule],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss'
})
export class SwitchComponent {
  public readonly value = input<boolean>(false)
  public  onChange = output<boolean>()

  protected onToggleChange(value: boolean) {
    this.onChange.emit(value)
  }
}
