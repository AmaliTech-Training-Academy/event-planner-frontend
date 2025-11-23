import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

export interface EventStatistic {
  readonly label: string;
  readonly count: number;
  readonly color: string;
  readonly icon?: string;
}

interface YAxisLabel {
  value: number;
  label: string;
  position: number; // percentage from bottom
}

@Component({
  selector: 'app-event-statistics',
  standalone: true,
  imports: [],
  templateUrl: './event-statistics.component.html',
  styleUrls: ['./event-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventStatisticsComponent {
  public readonly statistics = input.required<ReadonlyArray<EventStatistic>>();
  public readonly title = input<string>('Event Statistics');

  private readonly _CHART_HEIGHT = 200; // px
  private readonly _AXIS_STEPS = 4; // Number of divisions (creates 5 labels: 0, 25%, 50%, 75%, 100%)

  // Calculate the maximum value for the Y-axis (rounded up to a nice number)
  public readonly maxAxisValue = computed<number>(() => {
    const stats = this.statistics();
    if (stats.length === 0) return 100;

    const maxCount = Math.max(...stats.map((s) => s.count));
    return this._roundUpToNiceNumber(maxCount);
  });

  // Generate Y-axis labels based on the max value
  public readonly yAxisLabels = computed<YAxisLabel[]>(() => {
    const max = this.maxAxisValue();
    const labels: YAxisLabel[] = [];

    for (let i = this._AXIS_STEPS; i >= 0; i--) {
      const value = (max / this._AXIS_STEPS) * i;
      labels.push({
        value,
        label: this._formatAxisLabel(value),
        position: (i / this._AXIS_STEPS) * 100,
      });
    }

    return labels;
  });

  // Calculate bar height as percentage of chart height
  public getBarHeightPercent(count: number): number {
    const max = this.maxAxisValue();
    if (max === 0) return 0;
    return (count / max) * 100;
  }

  public formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
    }
    return num.toString();
  }

  public trackByStat(_index: number, stat: EventStatistic): string {
    return stat.label;
  }

  public trackByLabel(_index: number, label: YAxisLabel): number {
    return label.value;
  }

  // Round up to a "nice" number for the axis (e.g., 193000 -> 200000)
  private _roundUpToNiceNumber(value: number): number {
    if (value === 0) return 100;

    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const normalized = value / magnitude;

    let niceNormalized: number;
    if (normalized <= 1) niceNormalized = 1;
    else if (normalized <= 2) niceNormalized = 2;
    else if (normalized <= 5) niceNormalized = 5;
    else niceNormalized = 10;

    return niceNormalized * magnitude;
  }

  private _formatAxisLabel(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000) + 'K';
    }
    return value.toString();
  }
}