// event-statistics.component.ts
import { Component, input, signal } from '@angular/core';
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
  public statistics = input.required<EventStatistic[]>();
  public title = input<string>('Event Statistics');

  public formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
