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
  private readonly _dashboardStatsService = inject(DashboardStatsBackendService);

  private readonly _staticCards: DashboardCard[] = [];

  protected readonly dashboardCards = signal<DashboardCard[]>([]);

  // ------------------------------------------------------------------------
  // TIME SERIES DATA (from API)
  // ------------------------------------------------------------------------
  protected readonly totalUsersData = signal<TimeSeriesDataPoint[]>([]);
  protected readonly totalEventsData = signal<TimeSeriesDataPoint[]>([]);
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

    const coOrganizers =
      cards.find((c) => c.title === 'Active Co-organizers')?.count || 0;

    const attendees = cards.find((c) => c.title === 'Admin')?.count || 0;

    const other = cards.find((c) => c.title === 'Other Users')?.count || 0;

    // Total ACTIVE users only
    const totalActive = organizers + coOrganizers + attendees + other;

    if (totalActive === 0) return [];

    const pct = (value: number) =>
      Number(((value / totalActive) * 100).toFixed(1)); // <-- one decimal place

    return [
      {
        category: 'Attendees',
        percentage: pct(attendees),
        color: '#FF6B35',
      },
      {
        category: 'Organizers',
        percentage: pct(organizers),
        color: '#374151',
      },
      {
        category: 'Co-organizers',
        percentage: pct(coOrganizers),
        color: '#9CA3AF',
      },
      {
        category: 'Other',
        percentage: pct(other),
        color: '#6B7280',
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

    this._userService.fetchAllUsers(0, 10).subscribe();

    // Fetch chart data from API
    this._fetchRegistrationData();
    this._fetchEventData();
  }

  /**
   * Fetches user registration statistics from the API
   */
  private _fetchRegistrationData(): void {
    this.isLoadingUsers.set(true);
    this._dashboardStatsService.getRegistrationGraphData().subscribe({
      next: (response) => {
        if (response.data?.monthlyData) {
          const transformedData = this._transformRegistrationData(
            response.data.monthlyData
          );
          this.totalUsersData.set(transformedData);
        }
        this.isLoadingUsers.set(false);
      },
      error: (error) => {
        console.error('Error fetching registration data:', error);
        this.totalUsersData.set([]);
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
          const transformedData = this._transformEventData(
            response.data.monthlyData
          );
          this.totalEventsData.set(transformedData);
        }
        this.isLoadingEvents.set(false);
      },
      error: (error) => {
        console.error('Error fetching event data:', error);
        this.totalEventsData.set([]);
        this.isLoadingEvents.set(false);
      },
    });
  }

  /**
   * Transforms registration API response to chart format
   */
  private _transformRegistrationData(
    monthlyData: RegistrationMonthlyDataPoint[][]
  ): TimeSeriesDataPoint[] {
    if (!monthlyData || monthlyData.length === 0) return [];

    // Flatten all years data and transform
    const allData = monthlyData.flat();
    return allData.map((item) => ({
      month: this._getMonthName(item.month),
      value: item.totalRegistrations,
    }));
  }

  /**
   * Transforms event API response to chart format
   */
  private _transformEventData(
    monthlyData: EventMonthlyDataPoint[][]
  ): TimeSeriesDataPoint[] {
    if (!monthlyData || monthlyData.length === 0) return [];

    // Flatten all years data and transform
    const allData = monthlyData.flat();
    return allData.map((item) => ({
      month: this._getMonthName(item.month),
      value: item.totalEventsCreated,
    }));
  }

  /**
   * Converts month number to abbreviated month name
   */
  private _getMonthName(month: number): string {
    const monthNames = [
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
    return monthNames[month - 1] || '';
  }

  protected switchChartTab(tab: 'users' | 'events'): void {
    this.activeChartTab.set(tab);
  }
}
