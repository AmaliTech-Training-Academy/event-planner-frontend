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
import type {
  EChartsOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';

export interface TrafficByDevice {
  device: string;
  value: number;
  color: string;
}

/**
 * Represents the structure of tooltip formatter parameters from ECharts.
 * Used as a workaround since ECharts doesn't properly export tooltip parameter types.
 */
interface TooltipFormatterParams {
  color: string;
  value: number;
  axisValue: string;
}

// --- Chart Config Constants ---
const GRID_CONFIG = {
  left: '3%',
  right: '4%',
  bottom: '15%',
  top: '10%',
  containLabel: true,
} as const;

const DEFAULT_X_AXIS: XAXisComponentOption = {
  type: 'category',
  axisLine: { lineStyle: { color: '#E5E7EB' } },
  axisTick: { show: false },
  axisLabel: { color: '#6B7280', fontSize: 12, interval: 0, rotate: 0 },
};

const DEFAULT_Y_AXIS: YAXisComponentOption = {
  type: 'value',
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: { lineStyle: { color: '#F3F4F6', type: 'solid' } },
  axisLabel: {
    color: '#6B7280',
    fontSize: 12,
    formatter: (value: number | string): string => {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      return numValue >= 1000
        ? `${(numValue / 1000).toFixed(0)}K`
        : numValue.toString();
    },
  },
};

const DEFAULT_TOOLTIP = (
  color: string,
  value: number,
  axisValue: string
): string => `
  <div class="tooltip-title">${axisValue}</div>
  <div class="tooltip-content">
    <span class="tooltip-dot" style="background: ${color}"></span>
    <span>Traffic:</span>
    <span class="tooltip-value">${value.toLocaleString()}</span>
  </div>
`;

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() public data: TrafficByDevice[] = [];

  public readonly isLoading = signal(false);
  public readonly chartOptions = signal<EChartsOption>({});

  public ngOnInit(): void {
    this._setChartData();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this._setChartData();
    }
  }

  private _setChartData(): void {
    if (!this.data?.length) {
      this._setEmptyState();
      return;
    }

    const devices = this.data.map((d) => d.device);
    const values = this.data.map((d) => d.value);
    const colors = this.data.map((d) => d.color);

    const options: EChartsOption = {
      grid: GRID_CONFIG,
      xAxis: {
        ...DEFAULT_X_AXIS,
        data: devices,
      },
      yAxis: DEFAULT_Y_AXIS,
      series: [
        {
          type: 'bar',
          data: values.map((v, i) => ({
            value: v,
            itemStyle: { color: colors[i], borderRadius: [8, 8, 0, 0] },
          })),
          barWidth: '40%',
          animationDuration: 800,
          animationEasing: 'cubicOut',
        },
      ],
      tooltip: this._createTooltipConfig(),
    };

    this.chartOptions.set(options);
  }

  private _setEmptyState(): void {
    this.chartOptions.set({
      title: {
        text: 'No data available',
        left: 'center',
        top: 'center',
        textStyle: { color: '#9CA3AF', fontSize: 14 },
      },
    });
  }

  private _createTooltipConfig(): EChartsOption['tooltip'] {
    return {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: { color: '#374151' },
      axisPointer: {
        type: 'shadow',
        shadowStyle: { color: 'rgba(0,0,0,0.05)' },
      },
      /**
       * Note: Using 'unknown' type because ECharts doesn't export the correct
       * TooltipFormatterCallback parameter type. This is a type-safe alternative
       * to 'any' that forces explicit casting and documents expected structure.
       */
      formatter: ((params: unknown) => {
        const typedParams = params as TooltipFormatterParams[];
        const param = typedParams[0];
        return DEFAULT_TOOLTIP(param.color, param.value, param.axisValue);
      }) as never,
    };
  }
}
