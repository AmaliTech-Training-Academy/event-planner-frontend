// dashboard-page.component.ts
import { Component, signal, inject } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
import { AdminUserCardComponent } from '../../../../shared/admin-ui/admin-user-card/admin-user-card.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [AdminUserCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent {
  private _layoutService = inject(LayoutService);

  public readonly dashboardCards = signal([
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

  ngOnInit(): void {
    this._layoutService.pageTitle.set('Dashboard Overview');
  }
}
