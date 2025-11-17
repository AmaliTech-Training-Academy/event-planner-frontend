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
  public activeToggle = input.required<boolean|null>();
  public tabChange = output<boolean|null>();

  protected onTabClick(value: boolean|null): void {
    if (value !== this.activeToggle()) {
      this.tabChange.emit(value);
    }
    else{
       this.tabChange.emit(null);
    }
  }
}
