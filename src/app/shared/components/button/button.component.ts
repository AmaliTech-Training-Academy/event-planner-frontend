import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'icon';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [CommonModule],
})
export class ButtonComponent {
  public variant = signal<ButtonVariant>('primary');
  public fullWidth = signal<boolean>(false);
  public disabled = signal<boolean>(false);

  @Input({ required: true }) label!: string;
  @Input() set type(value: ButtonVariant) {
    this.variant.set(value);
  }

  @Input() set isFullWidth(value: boolean) {
    this.fullWidth.set(value);
  }

  @Input() set isDisabled(value: boolean) {
    this.disabled.set(value);
  }

  @Output() clicked = new EventEmitter<void>();

  public onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
