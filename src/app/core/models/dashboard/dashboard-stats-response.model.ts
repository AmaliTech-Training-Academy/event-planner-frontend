// Monthly data point for events
export interface EventMonthlyDataPoint {
    year: number;
    month: number;
    totalEventsCreated: number;
}

// Monthly data point for registrations
export interface RegistrationMonthlyDataPoint {
    year: number;
    month: number;
    totalRegistrations: number;
}

// Metadata for dashboard statistics
export interface DashboardStatsMetadata {
    thisYear: number;
    lastYear: number;
    maxValue: number;
    dateRange: string;
}

// Event graph response
export interface EventGraphResponse {
    monthlyData: EventMonthlyDataPoint[][];
    metadata: DashboardStatsMetadata;
}

// Registration graph response
export interface RegistrationGraphResponse {
    monthlyData: RegistrationMonthlyDataPoint[][];
    metadata: DashboardStatsMetadata;
}
