export interface TimeSeriesDataPoint {
  month: string;
  value: number;
}


export interface TimeSeriesDataPoint {
  x: string | number | Date;
  y: number;
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