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
    return [
      this.type(), // e.g. "primary", "social"
      this.color(), // e.g. "edit", "power-active"
      this.extraClass(), // any external custom class
      this.fullWidth() ? 'full-width' : '',
    ]
      .flat()
      .filter((cls): cls is string => !!cls && typeof cls === 'string');
  });
}
