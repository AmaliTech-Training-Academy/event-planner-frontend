import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
import { AdminUserCardComponent } from '../../../../shared/admin-ui/admin-user-card/admin-user-card.component';
import {
  LineChartComponent,
  TimeSeriesDataPoint,
} from './components/line-chart/line-chart.component';
import {
  BarChartComponent,
  TrafficByDevice,
} from './components/bar-chart/bar-chart.component';
import {
  DonutChartComponent,
  UserStatistics,
} from './components/donut-chart/donut-chart.component';
import { TrafficListComponent } from './components/traffic-list/traffic-list.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { UserManagementService } from '../../../../core/services/user-management.service';
import { DashboardStatsBackendService } from '../../../../core/services/backend/dashboard-stats-backend.service';
import {
  EventMonthlyDataPoint,
  RegistrationMonthlyDataPoint,
} from '../../../../core/models/dashboard/dashboard-stats-response.model';

interface DashboardCard {
  readonly title: string;
  readonly count: number;
  readonly percentageChange?: number;
  readonly icon: string;
  readonly bgColor: string;
  readonly iconColor: string;
}

interface TrafficByWebsite {
  readonly website: string;
  readonly percentage: number;
  readonly color: string;
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    AdminUserCardComponent,
    LineChartComponent,
    BarChartComponent,
    DonutChartComponent,
    TrafficListComponent,
    ButtonComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);
  private readonly _userService = inject(UserManagementService);
  private readonly _dashboardStatsService = inject(
    DashboardStatsBackendService
  );

  private readonly _staticCards: DashboardCard[] = [];
  private readonly _monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  protected readonly dashboardCards = signal<DashboardCard[]>([]);

  protected readonly visibleDashboardCards = computed(() => {
    const allowed = ['Total Users', 'Active Organizers', 'Admin', 'Deactivated'];
    return this.dashboardCards().filter((c) => allowed.includes(c.title));
  });

  // ------------------------------------------------------------------------
  // TIME SERIES DATA (from API) - Separated by year
  // ------------------------------------------------------------------------
  protected readonly totalUsersThisYear = signal<TimeSeriesDataPoint[]>([]);
  protected readonly totalUsersLastYear = signal<TimeSeriesDataPoint[]>([]);
  protected readonly totalEventsThisYear = signal<TimeSeriesDataPoint[]>([]);
  protected readonly totalEventsLastYear = signal<TimeSeriesDataPoint[]>([]);

  protected readonly usersMaxValue = signal<number | undefined>(undefined);
  protected readonly eventsMaxValue = signal<number | undefined>(undefined);

  protected readonly isLoadingUsers = signal(false);
  protected readonly isLoadingEvents = signal(false);

  protected readonly trafficByDevice: TrafficByDevice[] = [
    { device: 'Linux', value: 17500, color: '#9CA3AF' },
    { device: 'Mac', value: 30000, color: '#3B82F6' },
    { device: 'iOS', value: 21000, color: '#93C5FD' },
    { device: 'Windows', value: 35000, color: '#FF6B35' },
    { device: 'Android', value: 13000, color: '#FB923C' },
    { device: 'Other', value: 26000, color: '#374151' },
  ];

  protected readonly trafficByWebsite: TrafficByWebsite[] = [
    { website: 'Google', percentage: 85, color: '#FF6B35' },
    { website: 'Twitter', percentage: 65, color: '#FB923C' },
    { website: 'Facebook', percentage: 45, color: '#FDBA74' },
    { website: 'Pinterest', percentage: 30, color: '#FED7AA' },
    { website: 'Instagram', percentage: 20, color: '#FFEDD5' },
    { website: 'YouTube', percentage: 8, color: '#FFF7ED' },
  ];

  // ------------------------------------------------------------------------
  // UPDATED USER STATISTICS (Donut chart)
  // ------------------------------------------------------------------------
  protected readonly userStatistics = computed<UserStatistics[]>(() => {
    const cards = this.dashboardCards();

    const organizers =
      cards.find((c) => c.title === 'Active Organizers')?.count || 0;

    const totalUsers = cards.find((c) => c.title === 'Total Users')?.count || 0;
    const deactivated = cards.find((c) => c.title === 'Deactivated')?.count || 0;
    const activeUsers = Math.max(0, totalUsers - deactivated);

    const admin = cards.find((c) => c.title === 'Admin')?.count || 0;

    const other = cards.find((c) => c.title === 'Other Users')?.count || 0;

    const totalActive = organizers + activeUsers + admin + other;

    if (totalActive === 0) return [];

    const pct = (value: number) =>
      Number(((value / totalActive) * 100).toFixed(1));

    return [
      {
        category: 'Admin',
        percentage: pct(admin),
        color: '#D97543', // Burnt orange from design
      },
      {
        category: 'Organizers',
        percentage: pct(organizers),
        color: '#3B3B3B', // Darkest gray from design
      },
      {
        category: 'Active Users',
        percentage: pct(activeUsers),
        color: '#6B6B6B', // Medium gray from design
      },
      {
        category: 'Other',
        percentage: pct(other),
        color: '#5C5C5C', // Dark gray from design
      },
    ];
  });

  protected readonly activeChartTab = signal<'users' | 'events'>('users');

  ngOnInit(): void {
    this._layoutService.pageTitle.set('Dashboard Overview');
    this._layoutService.logoSrc.set('icons/editor-icon.png');
    this._layoutService.logoAlt.set('Dashboard Icon');

    // Live card updates
    this._userService.userCards$.subscribe((cards) => {
      this.dashboardCards.set([...cards, ...this._staticCards]);
    });

    // Fetch more users to get better statistics (fetch first 100 users)
    this._userService.fetchAllUsers(0, 100).subscribe();

    // Fetch chart data from API
    this._fetchRegistrationData();
    this._fetchEventData();
  }


  private _fetchRegistrationData(): void {
    this.isLoadingUsers.set(true);
    this._dashboardStatsService.getRegistrationGraphData().subscribe({
      next: (response) => {
        if (response.data?.monthlyData) {
          const { thisYear, lastYear } = this._transformRegistrationData(
            response.data.monthlyData
          );
          this.totalUsersThisYear.set(thisYear);
          this.totalUsersLastYear.set(lastYear);

          // Set maxValue from metadata
          if (response.data.metadata?.maxValue !== undefined) {
            this.usersMaxValue.set(response.data.metadata.maxValue);
          }
        }
        this.isLoadingUsers.set(false);
      },
      error: (error) => {
        console.error('Error fetching registration data:', error);
        this.totalUsersThisYear.set(this._createEmptyMonthData());
        this.totalUsersLastYear.set(this._createEmptyMonthData());
        this.usersMaxValue.set(undefined);
        this.isLoadingUsers.set(false);
      },
    });
  }

  /**
   * Fetches event creation statistics from the API
   */
  private _fetchEventData(): void {
    this.isLoadingEvents.set(true);
    this._dashboardStatsService.getEventGraphData().subscribe({
      next: (response) => {
        if (response.data?.monthlyData) {
          const { thisYear, lastYear } = this._transformEventData(
            response.data.monthlyData
          );
          this.totalEventsThisYear.set(thisYear);
          this.totalEventsLastYear.set(lastYear);

          // Set maxValue from metadata
          if (response.data.metadata?.maxValue !== undefined) {
            this.eventsMaxValue.set(response.data.metadata.maxValue);
          }
        }
        this.isLoadingEvents.set(false);
      },
      error: (error) => {
        console.error('Error fetching event data:', error);
        this.totalEventsThisYear.set(this._createEmptyMonthData());
        this.totalEventsLastYear.set(this._createEmptyMonthData());
        this.eventsMaxValue.set(undefined);
        this.isLoadingEvents.set(false);
      },
    });
  }

  /**
   * Transforms registration API response to chart format
   * Separates this year and last year data with all 12 months
   */
  private _transformRegistrationData(
    monthlyData: RegistrationMonthlyDataPoint[][]
  ): { thisYear: TimeSeriesDataPoint[]; lastYear: TimeSeriesDataPoint[] } {
    // Initialize all 12 months with 0 values
    const thisYearData = this._createEmptyMonthData();
    const lastYearData = this._createEmptyMonthData();

    if (!monthlyData || monthlyData.length === 0) {
      return { thisYear: thisYearData, lastYear: lastYearData };
    }

    // Process this year's data (monthlyData[0])
    if (monthlyData[0] && Array.isArray(monthlyData[0])) {
      monthlyData[0].forEach((item) => {
        const monthIndex = item.month - 1; // Convert 1-12 to 0-11
        if (monthIndex >= 0 && monthIndex < 12) {
          thisYearData[monthIndex].value = item.totalRegistrations;
        }
      });
    }

    // Process last year's data (monthlyData[1]) if it exists
    if (monthlyData[1] && Array.isArray(monthlyData[1])) {
      monthlyData[1].forEach((item) => {
        const monthIndex = item.month - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          lastYearData[monthIndex].value = item.totalRegistrations;
        }
      });
    }

    return { thisYear: thisYearData, lastYear: lastYearData };
  }

  /**
   * Transforms event API response to chart format
   * Separates this year and last year data with all 12 months
   */
  private _transformEventData(monthlyData: EventMonthlyDataPoint[][]): {
    thisYear: TimeSeriesDataPoint[];
    lastYear: TimeSeriesDataPoint[];
  } {
    // Initialize all 12 months with 0 values
    const thisYearData = this._createEmptyMonthData();
    const lastYearData = this._createEmptyMonthData();

    if (!monthlyData || monthlyData.length === 0) {
      return { thisYear: thisYearData, lastYear: lastYearData };
    }

    // Process this year's data (monthlyData[0])
    if (monthlyData[0] && Array.isArray(monthlyData[0])) {
      monthlyData[0].forEach((item) => {
        const monthIndex = item.month - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          thisYearData[monthIndex].value = item.totalEventsCreated;
        }
      });
    }

    // Process last year's data (monthlyData[1]) if it exists
    if (monthlyData[1] && Array.isArray(monthlyData[1])) {
      monthlyData[1].forEach((item) => {
        const monthIndex = item.month - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          lastYearData[monthIndex].value = item.totalEventsCreated;
        }
      });
    }

    return { thisYear: thisYearData, lastYear: lastYearData };
  }

  /**
   * Creates an empty dataset with all 12 months initialized to 0
   */
  private _createEmptyMonthData(): TimeSeriesDataPoint[] {
    return this._monthNames.map((month) => ({
      month,
      value: 0,
    }));
  }

  protected switchChartTab(tab: 'users' | 'events'): void {
    this.activeChartTab.set(tab);
  }
}
