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
import { NgxEchartsModule, provideEchartsCore } from 'ngx-echarts';
import type {
  EChartsOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';
import { generateMultiSeriesTooltipHtml } from '../../../../../../shared/utils/chart-tooltip.html';

export interface TimeSeriesDataPoint {
  month: string;
  value: number;
}

export interface LineSeriesConfig {
  name: string;
  data: TimeSeriesDataPoint[];
  color: string;
  showArea?: boolean;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  areaGradient?: {
    start: string;
    end: string;
  };
}

interface TooltipFormatterParams {
  seriesName: string;
  value: number;
  color: string | { colorStops: Array<{ offset: number; color: string }> };
  axisValue: string;
}

const GRID_CONFIG = {
  left: '3%',
  right: '4%',
  bottom: '10%',
  top: '10%',
  containLabel: true,
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
  min: 0, 
  max: 30000, 
  interval: 10000,
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
  providers: [provideEchartsCore({ echarts: () => import('echarts') })],  
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() public seriesConfig: LineSeriesConfig[] = [];

  @Input() public thisYearData: TimeSeriesDataPoint[] = [];
  @Input() public lastYearData: TimeSeriesDataPoint[] = [];

  @Input() public chartTitle?: string;
  @Input() public showLegend: boolean = true;
  @Input() public height: string = '400px';
  @Input() public animationDuration: number = 800;
  @Input() public smooth: boolean = true;

  public readonly isLoading = signal(false);
  public readonly chartOptions = signal<EChartsOption>({});

  public ngOnInit(): void {
    this._updateChartOptions();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['seriesConfig'] ||
      changes['thisYearData'] ||
      changes['lastYearData']
    ) {
      this._updateChartOptions();
    }
  }

  private _updateChartOptions(): void {
    const series = this._getSeriesData();

    if (!series.length) {
      this._setEmptyState();
      return;
    }

    const months = this._extractMonths(series);
    const chartSeries = series.map((config) => this._createSeries(config));

    const options: EChartsOption = {
      title: this.chartTitle
        ? {
            text: this.chartTitle,
            left: 'left',
            textStyle: { color: '#374151', fontSize: 16, fontWeight: 600 },
          }
        : undefined,
      grid: GRID_CONFIG,
      legend: this.showLegend
        ? {
            bottom: 0,
            left: 'center',
            textStyle: { color: '#6B7280' },
          }
        : undefined,
      xAxis: {
        ...DEFAULT_X_AXIS,
        data: months,
      } as XAXisComponentOption,
      yAxis: DEFAULT_Y_AXIS,
      series: chartSeries,
      tooltip: this._createTooltipConfig(),
    };

    this.chartOptions.set(options);
  }

  private _getSeriesData(): LineSeriesConfig[] {
    if (this.seriesConfig?.length) {
      return this.seriesConfig;
    }

    const legacySeries: LineSeriesConfig[] = [];

    if (this.thisYearData?.length) {
      legacySeries.push({
        name: 'This year',
        data: this.thisYearData,
        color: '#FF6B35',
        showArea: true,
        lineStyle: 'solid',
        areaGradient: {
          start: 'rgba(255, 107, 53, 0.2)',
          end: 'rgba(255, 107, 53, 0.05)',
        },
      });
    }

    if (this.lastYearData?.length) {
      legacySeries.push({
        name: 'Last year',
        data: this.lastYearData,
        color: '#6B7280',
        showArea: false,
        lineStyle: 'dashed',
      });
    }

    return legacySeries;
  }

  private _extractMonths(series: LineSeriesConfig[]): string[] {
    const firstSeries = series[0];
    return firstSeries?.data?.map((d) => d.month) ?? [];
  }

  private _createSeries(config: LineSeriesConfig) {
    const values = config.data.map((d) => d.value);
    const lineStyleMap = {
      solid: 'solid' as const,
      dashed: 'dashed' as const,
      dotted: 'dotted' as const,
    };

    const series: any = {
      name: config.name,
      type: 'line' as const,
      data: values,
      smooth: this.smooth,
      symbol: 'none',
      animationDuration: this.animationDuration,
      lineStyle: {
        color: config.color,
        width: 2,
        type: lineStyleMap[config.lineStyle ?? 'solid'],
      },
    };

    if (config.showArea && config.areaGradient) {
      series.areaStyle = {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: config.areaGradient.start },
            { offset: 1, color: config.areaGradient.end },
          ],
        },
      };
    }

    return series;
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
      formatter: ((params: unknown) => {
        const paramsArray = params as TooltipFormatterParams[];

        if (!paramsArray?.length) {
          return '';
        }

        return generateMultiSeriesTooltipHtml({
          axisValue: paramsArray[0].axisValue,
          series: paramsArray.map((param) => ({
            color: this._extractColor(param.color),
            name: param.seriesName,
            value: param.value,
          })),
        });
      }) as never,
    };
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
