// shared/utils/chart-tooltip-html.ts
export interface TooltipParams {
  color: string;
  value: number;
  axisValue: string;
  label: string; 
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
