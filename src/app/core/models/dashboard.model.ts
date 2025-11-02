export interface DashboardCard {
  title: string;
  count: number;
  percentageChange?: number;
  icon: string;
  bgColor: string;
  iconColor: string;
}

export interface TimeSeriesDataPoint {
  month: string;
  value: number;
}

export interface TrafficByDevice {
  device: string;
  value: number;
  color: string;
}

export interface TrafficByWebsite {
  website: string;
  percentage: number;
  color: string;
}

export interface UserStatistics {
  category: string;
  percentage: number;
  color: string;
}
