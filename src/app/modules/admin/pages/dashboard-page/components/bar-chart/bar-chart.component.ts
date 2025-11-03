import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  ChangeDetectionStrategy,
  ApplicationRef,
  EnvironmentInjector,
  createComponent,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import type {
  EChartsOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';
import { ChartTooltipComponent } from '../../../../../../shared/chart-tool-tip/chart-tool-tip.component';

export interface TrafficByDevice {
  device: string;
  value: number;
  color: string;
}

interface TooltipFormatterParams {
  color: string;
  value: number;
  axisValue: string;
}

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

  constructor(
    private readonly _appRef: ApplicationRef,
    private readonly _injector: EnvironmentInjector
  ) {}

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
      backgroundColor: 'transparent',
      borderWidth: 0,
      axisPointer: {
        type: 'shadow',
        shadowStyle: { color: 'rgba(0,0,0,0.05)' },
      },
      formatter: ((params: unknown) => {
        const typedParams = params as TooltipFormatterParams[];
        const param = typedParams[0];
        return this._renderTooltipComponent(
          param.color,
          param.value,
          param.axisValue
        );
      }) as never,
    };
  }

  private _renderTooltipComponent(
    color: string,
    value: number,
    axisValue: string
  ): string {
    const componentRef = createComponent(ChartTooltipComponent, {
      environmentInjector: this._injector,
    });

    componentRef.setInput('color', color);
    componentRef.setInput('value', value);
    componentRef.setInput('axisValue', axisValue);

    this._appRef.attachView(componentRef.hostView);
    const html = (componentRef.location.nativeElement as HTMLElement).outerHTML;
    this._appRef.detachView(componentRef.hostView);
    componentRef.destroy();

    return html;
  }
}
