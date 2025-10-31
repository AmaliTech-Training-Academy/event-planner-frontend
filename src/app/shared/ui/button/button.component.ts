import { CommonModule } from '@angular/common';
import { Component, input, computed, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  public readonly type = input<'primary' | 'secondary' | 'social' | 'action' | 'plain'>(
    'primary'
  );
  public readonly disabled = input(false);
  public readonly fullWidth = input(false);
  public readonly onClick = output<void>();

  protected handleClick(): void {
    if (this.disabled()) return;

    this.onClick.emit();
  }
  
  public readonly color = input<
    'view' | 'edit' | 'delete' | 'power' | 'inactive' | string | undefined
  >();
  public readonly extraClass = input<string | string[] | undefined>();

  public readonly buttonType = input<'button' | 'submit' | 'reset'>('button');

  public readonly classes = computed((): string[] => {
    const extra = this.extraClass();
    const normalizedExtra =
      typeof extra === 'string'
        ? extra.split(' ').filter(Boolean)
        : Array.isArray(extra)
        ? extra
        : [];

    return [
      `app-button`,
      `app-button--${this.type()}`,
      this.color() ? `btn-${this.color()}` : '',
      this.fullWidth() ? 'full-width' : '',
      ...normalizedExtra,
    ].filter(Boolean);
  });
}
