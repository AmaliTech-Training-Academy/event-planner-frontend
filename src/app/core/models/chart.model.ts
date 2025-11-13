export interface TimeSeriesDataPoint {
  month: string;
  value: number;
}

export interface LineSeriesConfig {
  name: string; // The name that appears in the legend (e.g., "This year")
  data: TimeSeriesDataPoint[]; // The array of (x, y) points for the line
  color: string; // The color of the line (e.g., "#CC3F02")
  showArea?: boolean; // (Optional) Whether to show a colored area beneath the line
  lineStyle?: 'solid' | 'dashed' | 'dotted'; // (Optional) The line style
  areaGradient?: {
    // (Optional) The gradient for the area
    start: string;
    end: string;
  };
}