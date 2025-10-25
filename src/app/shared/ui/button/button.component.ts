import { CommonModule } from '@angular/common';
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  /** ✅ Core input variants (existing usage still valid) */
  public readonly type = input<'primary' | 'secondary' | 'social' | 'action'>(
    'primary'
  );

  /** ✅ Support for disabled state */
  public readonly disabled = input(false);

  /** ✅ Support for full width buttons */
  public readonly fullWidth = input(false);

  /** ✅ New: optional color for contextual actions (edit, view, delete, power) */
  public readonly color = input<
    'view' | 'edit' | 'delete' | 'power' | 'inactive' | string | undefined
  >();

  /** ✅ New: allows adding custom class names externally */
  public readonly extraClass = input<string | string[] | undefined>();

  public readonly classes = computed((): string[] => {
    const extra = this.extraClass();

    const normalizedExtra =
      typeof extra === 'string'
        ? extra.split(' ').filter(Boolean)
        : Array.isArray(extra)
        ? extra
        : [];

    return [
      `app-button`, // ensure base class always present
      `app-button--${this.type()}`, // consistent with type modifier pattern
      this.color() ? `btn-${this.color()}` : '',
      this.fullWidth() ? 'full-width' : '',
      ...normalizedExtra,
    ].filter(Boolean);
  });
}
