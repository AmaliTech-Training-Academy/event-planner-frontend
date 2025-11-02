import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
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
import { ButtonComponent } from "../../../../shared/ui/button/button.component";

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
    ButtonComponent
],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);

  public readonly dashboardCards = signal<DashboardCard[]>([
    {
      title: 'Total Users',
      count: 2593,
      percentageChange: 11.01,
      icon: 'icons/user-icon-orange.png',
      bgColor: '#FFF4ED',
      iconColor: '#FF6B2C',
    },
    {
      title: 'Total Events',
      count: 342,
      percentageChange: 6.45,
      icon: 'icons/user-icon-blue.png',
      bgColor: '#E3F2FD',
      iconColor: '#2196F3',
    },
    {
      title: 'Active Venues',
      count: 29,
      icon: 'icons/user-icon-green.png',
      bgColor: '#E8F5E9',
      iconColor: '#4CAF50',
    },
    {
      title: 'Pending Approvals',
      count: 8,
      icon: 'icons/user-icon-red.png',
      bgColor: '#FFEBEE',
      iconColor: '#F44336',
    },
  ]);

  public readonly totalUsersData = signal<TimeSeriesDataPoint[]>([
    { month: 'Jan', value: 12000 },
    { month: 'Feb', value: 8000 },
    { month: 'Mar', value: 15000 },
    { month: 'Apr', value: 25000 },
    { month: 'May', value: 28000 },
    { month: 'Jun', value: 22000 },
    { month: 'Jul', value: 24000 },
  ]);

  public readonly totalEventsData = signal<TimeSeriesDataPoint[]>([
    { month: 'Jan', value: 5000 },
    { month: 'Feb', value: 13000 },
    { month: 'Mar', value: 12000 },
    { month: 'Apr', value: 20000 },
    { month: 'May', value: 7000 },
    { month: 'Jun', value: 15000 },
    { month: 'Jul', value: 30000 },
  ]);

  public readonly trafficByDevice = signal<TrafficByDevice[]>([
    { device: 'Linux', value: 17500, color: '#9CA3AF' },
    { device: 'Mac', value: 30000, color: '#3B82F6' },
    { device: 'iOS', value: 21000, color: '#93C5FD' },
    { device: 'Windows', value: 35000, color: '#FF6B35' },
    { device: 'Android', value: 13000, color: '#FB923C' },
    { device: 'Other', value: 26000, color: '#374151' },
  ]);

  public readonly trafficByWebsite = signal<TrafficByWebsite[]>([
    { website: 'Google', percentage: 85, color: '#FF6B35' },
    { website: 'Twitter', percentage: 65, color: '#FB923C' },
    { website: 'Facebook', percentage: 45, color: '#FDBA74' },
    { website: 'Pinterest', percentage: 30, color: '#FED7AA' },
    { website: 'Instagram', percentage: 20, color: '#FFEDD5' },
    { website: 'YouTube', percentage: 8, color: '#FFF7ED' },
  ]);

  public readonly userStatistics = signal<UserStatistics[]>([
    { category: 'Attendees', percentage: 52.1, color: '#FF6B35' },
    { category: 'Organizers', percentage: 22.8, color: '#374151' },
    { category: 'Co-organizers', percentage: 13.9, color: '#6B7280' },
    { category: 'Other', percentage: 11.2, color: '#9CA3AF' },
  ]);

  public readonly activeChartTab = signal<'users' | 'events'>('users');

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Dashboard Overview');
  }

  public switchChartTab(tab: 'users' | 'events'): void {
    this.activeChartTab.set(tab);
  }
}
