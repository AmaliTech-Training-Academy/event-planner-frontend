import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [CommonModule],
})
export class ButtonComponent {
  public readonly type = input<'primary' | 'secondary' | 'social' | 'action'>(
    'primary'
  );
  public readonly disabled = input(false);
  public readonly fullWidth = input(false);
  public readonly color = input<
    'view' | 'edit' | 'delete' | 'power' | 'inactive' | string | undefined
  >();
  public readonly extraClass = input<string | string[] | undefined>();

  /** ✅ Filters out undefined/null before passing to ngClass */
  public getClasses(): string[] {
    return [this.color(), this.extraClass()]
      .flat()
      .filter((cls): cls is string => !!cls && typeof cls === 'string');
  }
}
