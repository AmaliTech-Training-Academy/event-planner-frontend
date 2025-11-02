import { Component, Input, OnInit, signal } from '@angular/core';
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
  template: `
    <div class="donut-chart">
      <div class="donut-chart__container">
        <div
          echarts
          [options]="chartOptions()"
          [loading]="isLoading()"
          class="chart"
        ></div>
        <div class="donut-chart__legend">
          @for (item of data; track item.category) {
          <div class="legend-item">
            <div class="legend-item__info">
              <span class="legend-dot" [style.background]="item.color"></span>
              <span class="legend-label">{{ item.category }}</span>
            </div>
            <span class="legend-value">{{ item.percentage }}%</span>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @use 'colors' as *;
      @use 'typography' as *;
      @use 'variables' as *;

      .donut-chart {
        width: 100%;
        height: 100%;
        min-height: 350px;

        &__container {
          display: flex;
          align-items: center;
          gap: $spacing-6;
          height: 100%;
        }

        &__legend {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: $spacing-4;
        }

        .chart {
          flex: 1;
          height: 100%;
          min-height: 300px;
        }
      }

      .legend-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: $spacing-3;

        &__info {
          display: flex;
          align-items: center;
          gap: $spacing-2;
        }
      }

      .legend-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .legend-label {
        @include body-2;
        color: $gray-700;
      }

      .legend-value {
        @include body-2;
        color: $header-dark;
        font-weight: 600;
      }

      @media (max-width: 768px) {
        .donut-chart__container {
          flex-direction: column;
        }

        .chart {
          min-height: 250px;
        }
      }
    `,
  ],
})
export class DonutChartComponent implements OnInit {
  @Input() data: UserStatistics[] = [];

  public readonly isLoading = signal(false);
  public readonly chartOptions = signal<EChartsOption>({});

  ngOnInit() {
    this.updateChartOptions();
  }

  ngOnChanges() {
    this.updateChartOptions();
  }

  private updateChartOptions() {
    const chartData = this.data.map((item) => ({
      name: item.category,
      value: item.percentage,
      itemStyle: {
        color: item.color,
      },
    }));

    this.chartOptions.set({
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
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: false,
            },
            scale: true,
            scaleSize: 5,
          },
          labelLine: {
            show: false,
          },
          data: chartData,
        },
      ],
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        textStyle: {
          color: '#374151',
        },
        formatter: (params: any) => {
          return `
            <div style="font-weight: 600; margin-bottom: 8px;">${params.name}</div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color};"></span>
              <span style="color: #6B7280;">Percentage:</span>
              <span style="font-weight: 600;">${params.value}%</span>
            </div>
          `;
        },
      },
    });
  }
}
