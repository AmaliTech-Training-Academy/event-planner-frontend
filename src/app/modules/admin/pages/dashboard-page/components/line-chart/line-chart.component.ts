import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import type {
  EChartsOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';

export interface TimeSeriesDataPoint {
  month: string;
  value: number;
}

/**
 * Represents the structure of tooltip formatter parameters from ECharts.
 * Used as a workaround since ECharts doesn't properly export tooltip parameter types.
 */
interface TooltipFormatterParams {
  seriesName: string;
  value: number;
  color: string | { colorStops: Array<{ offset: number; color: string }> };
  axisValue: string;
}

// --- Chart Config Constants ---
const GRID_CONFIG = {
  left: '3%',
  right: '4%',
  bottom: '10%',
  top: '10%',
  containLabel: true,
} as const;

const LINE_CHART_CONFIG = {
  colors: {
    thisYear: '#FF6B35',
    lastYear: '#6B7280',
  },
  lineWidth: 2,
  areaGradient: {
    thisYear: {
      start: 'rgba(255, 107, 53, 0.2)',
      end: 'rgba(255, 107, 53, 0.05)',
    },
  },
} as const;

const DEFAULT_X_AXIS: Omit<XAXisComponentOption, 'data'> = {
  type: 'category',
  boundaryGap: false,
  axisLine: {
    lineStyle: { color: '#E5E7EB' },
  },
  axisLabel: {
    color: '#6B7280',
    fontSize: 12,
  },
};

const DEFAULT_Y_AXIS: YAXisComponentOption = {
  type: 'value',
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: {
    lineStyle: { color: '#F3F4F6', type: 'solid' },
  },
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

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['thisYearData'] || changes['lastYearData']) {
      this._updateChartOptions();
    }
  }

  private _updateChartOptions(): void {
    if (!this.thisYearData?.length && !this.lastYearData?.length) {
      this._setEmptyState();
      return;
    }

    const months = this.thisYearData?.map((d) => d.month) ?? [];
    const thisYearValues = this.thisYearData?.map((d) => d.value) ?? [];
    const lastYearValues = this.lastYearData?.map((d) => d.value) ?? [];

    const options: EChartsOption = {
      grid: GRID_CONFIG,
      xAxis: {
        ...DEFAULT_X_AXIS,
        data: months,
      } as XAXisComponentOption,
      yAxis: DEFAULT_Y_AXIS,
      series: [
        this._createThisYearSeries(thisYearValues),
        this._createLastYearSeries(lastYearValues),
      ],
      tooltip: this._createTooltipConfig(),
    };

    this.chartOptions.set(options);
  }
  private _createThisYearSeries(data: number[]) {
    return {
      name: 'This year',
      type: 'line' as const,
      data,
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: LINE_CHART_CONFIG.colors.thisYear,
        width: LINE_CHART_CONFIG.lineWidth,
      },
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: LINE_CHART_CONFIG.areaGradient.thisYear.start },
            { offset: 1, color: LINE_CHART_CONFIG.areaGradient.thisYear.end },
          ],
        },
      },
    };
  }

  private _createLastYearSeries(data: number[]) {
    return {
      name: 'Last year',
      type: 'line' as const,
      data,
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: LINE_CHART_CONFIG.colors.lastYear,
        width: LINE_CHART_CONFIG.lineWidth,
        type: 'dashed' as const,
      },
    };
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
      /**
       * Note: Using 'unknown' type because ECharts doesn't export the correct
       * TooltipFormatterCallback parameter type. This is a type-safe alternative
       * to 'any' that forces explicit casting and documents expected structure.
       */
      formatter: ((params: unknown) => {
        const paramsArray = params as TooltipFormatterParams[];
        return this._formatTooltip(paramsArray);
      }) as never,
    };
  }

  private _formatTooltip(params: TooltipFormatterParams[]): string {
    if (!params?.length) {
      return '';
    }

    let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`;

    params.forEach((param) => {
      const color = this._extractColor(param.color);
      result += `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${color};"></span>
          <span style="color: #6B7280;">${param.seriesName}:</span>
          <span style="font-weight: 600;">${param.value.toLocaleString()}</span>
        </div>
      `;
    });

    return result;
  }

  private _extractColor(
    color: string | { colorStops: Array<{ offset: number; color: string }> }
  ): string {
    if (typeof color === 'string') {
      return color;
    }
    return color.colorStops?.[0]?.color ?? '#000';
  }
}
