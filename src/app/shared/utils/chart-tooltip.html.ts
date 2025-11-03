// shared/utils/chart-tooltip-html.ts
export interface TooltipParams {
  color: string;
  value: number;
  axisValue: string;
  label?: string;
}

export interface MultiSeriesTooltipParams {
  axisValue: string;
  series: Array<{
    color: string;
    name: string;
    value: number;
  }>;
}

export function generateTooltipHtml({
  color,
  value,
  axisValue,
  label = 'Traffic',
}: TooltipParams): string {
  return `
    <div class="tooltip-title">${axisValue}</div>
    <div class="tooltip-content">
      <span class="tooltip-dot" style="background:${color}"></span>
      <span>${label}:</span>
      <span class="tooltip-value">${value}</span>
    </div>
  `;
}

export function generateMultiSeriesTooltipHtml({
  axisValue,
  series,
}: MultiSeriesTooltipParams): string {
  const seriesRows = series
    .map(
      (item) => `
        <div class="tooltip-row">
          <span class="tooltip-dot" style="background:${item.color}"></span>
          <span class="tooltip-series-name">${item.name}:</span>
          <span class="tooltip-value">${item.value.toLocaleString()}</span>
        </div>
      `
    )
    .join('');

  return `
    <div class="tooltip-title">${axisValue}</div>
    <div class="tooltip-content">
      ${seriesRows}
    </div>
  `;
}
