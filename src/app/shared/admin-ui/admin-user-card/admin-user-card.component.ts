import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UserCardData {
  title: string;
  count: number;
  percentageChange?: number;
  icon: string;
  bgColor: string;
  iconColor: string;
}

@Component({
  selector: 'app-admin-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-user-card.component.html',
  styleUrls: ['./admin-user-card.component.scss'],
})
export class AdminUserCardComponent {
  @Input() data!: UserCardData;

  isPositive = computed(
    () => this.data?.percentageChange && this.data.percentageChange > 0
  );
  isNegative = computed(
    () => this.data?.percentageChange && this.data.percentageChange < 0
  );
}
