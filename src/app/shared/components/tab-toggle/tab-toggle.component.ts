import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { TabToggle } from '../../../core/models/events';



@Component({
  selector: 'app-tab-toggle',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './tab-toggle.component.html',
  styleUrl: './tab-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabToggleComponent {
  public toggles = input.required<TabToggle[]>();
  public activeToggle = input.required<string>();
  public tabChange = output<string>();
  protected onTabClick(tabKey: string): void {
    if (tabKey !== this.activeToggle()) {
      this.tabChange.emit(tabKey);
    }
  }
}
