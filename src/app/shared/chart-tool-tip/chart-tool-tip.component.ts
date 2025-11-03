// chart-tooltip.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-tool-tip.component.html',
  styleUrls: ['./chart-tool-tip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartTooltipComponent {
  @Input() color!: string;
  @Input() value!: number;
  @Input() axisValue!: string;
  @Input() left = 0;
  @Input() top = 0;
}
