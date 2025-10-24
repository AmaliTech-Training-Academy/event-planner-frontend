import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
})
export class ButtonComponent {
  public readonly type = input<'primary' | 'secondary' | 'social'>('primary');
  public readonly disabled = input(false);
  public readonly fullWidth = input(false);
  public readonly onClick = output<void>();

  protected handleClick(): void {
    if (this.disabled()) return;

    this.onClick.emit();
  }

}
