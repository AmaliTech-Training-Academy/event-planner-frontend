import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

export interface TimeSeriesDataPoint {
  month: string;
  value: number;
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() public thisYearData: TimeSeriesDataPoint[] = [];
  @Input() public lastYearData: TimeSeriesDataPoint[] = [];

  public readonly isLoading = signal(false);
  public readonly chartOptions = signal<EChartsOption>({});

  public ngOnInit(): void {
    this._updateChartOptions();
  }

  public ngOnChanges(): void {
    this._updateChartOptions();
  }

  private _updateChartOptions(): void {
    const months = this.thisYearData?.map((d) => d.month) ?? [];
    const thisYearValues = this.thisYearData?.map((d) => d.value) ?? [];
    const lastYearValues = this.lastYearData?.map((d) => d.value) ?? [];

    this.chartOptions.set({
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: months,
        boundaryGap: false,
        axisLine: {
          lineStyle: { color: '#E5E7EB' },
        },
        axisLabel: {
          color: '#6B7280',
          fontSize: 12,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: '#F3F4F6', type: 'solid' },
        },
        axisLabel: {
          color: '#6B7280',
          fontSize: 12,
          formatter: (value: number) =>
            value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toString(),
        },
      },
      series: [
        {
          name: 'This year',
          type: 'line',
          data: thisYearValues,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#FF6B35', width: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 107, 53, 0.2)' },
                { offset: 1, color: 'rgba(255, 107, 53, 0.05)' },
              ],
            },
          },
        },
        {
          name: 'Last year',
          type: 'line',
          data: lastYearValues,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: '#6B7280',
            width: 2,
            type: 'dashed',
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        textStyle: { color: '#374151' },
        formatter: (params: any) => {
          if (!params?.length) return '';
          let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0]?.axisValue}</div>`;
          params.forEach((param: any) => {
            const color = param?.color?.colorStops
              ? param.color.colorStops[0].color
              : param?.color;
            result += `
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${color};"></span>
                <span style="color: #6B7280;">${param.seriesName}:</span>
                <span style="font-weight: 600;">${param.value?.toLocaleString?.()}</span>
              </div>
            `;
          });
          return result;
        },
      },
    });
  }
}
