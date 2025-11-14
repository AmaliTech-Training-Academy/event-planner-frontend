import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EventStatistic {
  readonly label: string;
  readonly count: number;
  readonly color: string;
  readonly icon?: string;
}

@Component({
  selector: 'app-event-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-statistics.component.html',
  styleUrls: ['./event-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventStatisticsComponent {
  // Public inputs
  public readonly statistics = input.required<ReadonlyArray<EventStatistic>>();
  public readonly title = input<string>('Event Statistics');

  // Private constants
  private readonly _MAX_BAR_HEIGHT = 120;
  private readonly _MIN_BAR_HEIGHT = 80;

  // Public computed values
  public readonly maxCount = computed<number>(() => {
    const stats = this.statistics();
    return stats.length > 0 ? Math.max(...stats.map((stat) => stat.count)) : 0;
  });

  // Public methods for template
  public formatNumber(num: number): string {
    if (num >= 1000) {
      return Math.round(num / 1000) + 'K';
    }
    return num.toString();
  }

  public getBarHeight(count: number): number {
    const max = this.maxCount();

    if (max === 0) {
      return this._MIN_BAR_HEIGHT;
    }

    const ratio = count / max;
    const heightRange = this._MAX_BAR_HEIGHT - this._MIN_BAR_HEIGHT;
    const calculatedHeight = this._MIN_BAR_HEIGHT + ratio * heightRange;

    return Math.max(this._MIN_BAR_HEIGHT, calculatedHeight);
  }

  public trackByStat(_index: number, stat: EventStatistic): string {
    return stat.label;
  }
}
