import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

export interface UserStatistics {
  category: string;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements OnInit, OnChanges {
  @Input() public data: UserStatistics[] = [];

  public readonly isLoading = signal(false);
  public readonly chartOptions = signal<EChartsOption>({});

  ngOnInit(): void {
    this.updateChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChartOptions();
    }
  }

  private updateChartOptions(): void {
    const chartData = this.data.map((item) => ({
      name: item.category,
      value: item.percentage,
      itemStyle: {
        color: item.color,
      },
    }));

    this.chartOptions.set({
      animationDuration: 600,
      animationEasing: 'cubicOut',
      series: [
        {
          type: 'pie',
          radius: ['55%', '85%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 3,
          },
          label: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 5,
          },
          labelLine: { show: false },
          data: chartData,
        },
      ],
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        textStyle: { color: '#374151' },
        formatter: (params: any) => `
          <div style="font-weight: 600; margin-bottom: 8px;">${params.name}</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color};"></span>
            <span style="color: #6B7280;">Percentage:</span>
            <span style="font-weight: 600;">${params.value}%</span>
          </div>
        `,
      },
      media: [
        {
          query: { maxWidth: 768 },
          option: {
            series: [{ radius: ['45%', '75%'] }],
          },
        },
      ],
    });
  }
}
