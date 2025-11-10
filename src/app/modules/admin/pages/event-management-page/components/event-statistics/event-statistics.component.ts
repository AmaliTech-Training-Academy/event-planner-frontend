import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EventStatistic {
  label: string;
  count: number;
  color: string;
  icon?: string;
}

@Component({
  selector: 'app-event-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-statistics.component.html',
  styleUrls: ['./event-statistics.component.scss'],
})
export class EventStatisticsComponent {
  public readonly statistics = input.required<EventStatistic[]>();
  public readonly title = input<string>('Event Statistics');

  private readonly _maxCount = computed<number>(() =>
    this._calculateMaxCount()
  );
  private readonly _MAX_BAR_HEIGHT = 120;
  private readonly _MIN_BAR_HEIGHT = 80;

  public formatNumber(num: number): string {
    return this._formatNumberWithSuffix(num);
  }

  public getBarHeight(count: number): number {
    return this._calculateBarHeight(count);
  }

  public trackByStat(_index: number, stat: EventStatistic): string {
    return stat.label;
  }

  private _calculateMaxCount(): number {
    const stats = this.statistics();
    return stats.length > 0 ? Math.max(...stats.map((stat) => stat.count)) : 0;
  }

  private _formatNumberWithSuffix(num: number): string {
    if (num >= 1000) {
      return Math.round(num / 1000) + 'K';
    }
    return num.toString();
  }

  private _calculateBarHeight(count: number): number {
    const maxCount = this._maxCount();

    if (maxCount === 0) {
      return this._MIN_BAR_HEIGHT;
    }

    const ratio = count / maxCount;
    const heightRange = this._MAX_BAR_HEIGHT - this._MIN_BAR_HEIGHT;
    const calculatedHeight = this._MIN_BAR_HEIGHT + ratio * heightRange;

    return Math.max(this._MIN_BAR_HEIGHT, calculatedHeight);
  }
}
