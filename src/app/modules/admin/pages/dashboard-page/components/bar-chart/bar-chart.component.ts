import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

export interface TrafficByDevice {
  device: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],

})
export class BarChartComponent implements OnInit {
  @Input() data: TrafficByDevice[] = [];

  public readonly isLoading = signal(false);
  public readonly chartOptions = signal<EChartsOption>({});

  ngOnInit() {
    this.updateChartOptions();
  }

  ngOnChanges() {
    this.updateChartOptions();
  }

  private updateChartOptions() {
    const devices = this.data.map((d) => d.device);
    const values = this.data.map((d) => d.value);
    const colors = this.data.map((d) => d.color);

    this.chartOptions.set({
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: devices,
        axisLine: {
          lineStyle: {
            color: '#E5E7EB',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#6B7280',
          fontSize: 12,
          interval: 0,
          rotate: 0,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#F3F4F6',
            type: 'solid',
          },
        },
        axisLabel: {
          color: '#6B7280',
          fontSize: 12,
          formatter: (value: number) => {
            if (value >= 1000) {
              return `${(value / 1000).toFixed(0)}K`;
            }
            return value.toString();
          },
        },
      },
      series: [
        {
          type: 'bar',
          data: values.map((value, index) => ({
            value,
            itemStyle: {
              color: colors[index],
              borderRadius: [8, 8, 0, 0],
            },
          })),
          barWidth: '40%',
          label: {
            show: false,
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        textStyle: {
          color: '#374151',
        },
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
        },
        formatter: (params: any) => {
          const param = params[0];
          return `
            <div style="font-weight: 600; margin-bottom: 8px;">${
              param.axisValue
            }</div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${
                param.color
              };"></span>
              <span style="color: #6B7280;">Traffic:</span>
              <span style="font-weight: 600;">${param.value.toLocaleString()}</span>
            </div>
          `;
        },
      },
    });
  }
}
