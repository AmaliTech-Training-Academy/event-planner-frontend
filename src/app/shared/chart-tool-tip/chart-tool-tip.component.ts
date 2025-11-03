import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: 'app-chart-tooltip',
  templateUrl: './chart-tool-tip.component.html',
  styleUrls: ['./chart-tool-tip.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ChartTooltipComponent {
  @Input() color!: string;
  @Input() value!: number;
  @Input() axisValue!: string;
}
