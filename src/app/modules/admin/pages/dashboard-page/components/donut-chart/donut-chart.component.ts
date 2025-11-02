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
import type { EChartsOption } from 'echarts';

export interface UserStatistics {
  category: string;
  percentage: number;
  color: string;
}

interface TooltipFormatterParams {
  name: string;
  value: number;
  color: string;
}

// --- Chart Config Constants ---
const DONUT_CHART_CONFIG = {
  animation: {
    duration: 600,
    easing: 'cubicOut' as const,
  },
  radius: {
    desktop: ['55%', '85%'] as [string, string],
    mobile: ['45%', '75%'] as [string, string],
  },
  center: ['50%', '50%'] as [string, string],
  itemStyle: {
    borderRadius: 4,
    borderColor: '#fff',
    borderWidth: 3,
  },
  emphasis: {
    scale: true,
    scaleSize: 5,
  },
  mobileBreakpoint: 768,
} as const;

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

  public ngOnInit(): void {
    this._updateChartOptions();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this._updateChartOptions();
    }
  }

  private _updateChartOptions(): void {
    if (!this.data?.length) {
      this._setEmptyState();
      return;
    }

    const chartData = this._transformDataForChart();

    const options: EChartsOption = {
      animationDuration: DONUT_CHART_CONFIG.animation.duration,
      animationEasing: DONUT_CHART_CONFIG.animation.easing,
      series: [
        {
          type: 'pie',
          radius: DONUT_CHART_CONFIG.radius.desktop,
          center: DONUT_CHART_CONFIG.center,
          avoidLabelOverlap: false,
          itemStyle: DONUT_CHART_CONFIG.itemStyle,
          label: { show: false },
          emphasis: DONUT_CHART_CONFIG.emphasis,
          labelLine: { show: false },
          data: chartData,
        },
      ],
      tooltip: this._createTooltipConfig(),
      media: [
        {
          query: { maxWidth: DONUT_CHART_CONFIG.mobileBreakpoint },
          option: {
            series: [{ radius: DONUT_CHART_CONFIG.radius.mobile }],
          },
        },
      ],
    };

    this.chartOptions.set(options);
  }

  private _transformDataForChart(): Array<{
    name: string;
    value: number;
    itemStyle: { color: string };
  }> {
    return this.data.map((item) => ({
      name: item.category,
      value: item.percentage,
      itemStyle: { color: item.color },
    }));
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
      trigger: 'item',
      className: 'chart-tooltip',

      formatter: ((params: unknown) => {
        const typedParams = params as TooltipFormatterParams;
        return this._formatTooltip(typedParams);
      }) as never,
    };
  }

  private _formatTooltip(params: TooltipFormatterParams): string {
    return `
      <div class="tooltip-content">
        <div class="tooltip-title">${params.name}</div>
        <div class="tooltip-row">
          <span class="tooltip-dot" style="background:${params.color}"></span>
          <span class="tooltip-label">Percentage:</span>
          <span class="tooltip-value">${params.value}%</span>
        </div>
      </div>
    `;
  }
}
