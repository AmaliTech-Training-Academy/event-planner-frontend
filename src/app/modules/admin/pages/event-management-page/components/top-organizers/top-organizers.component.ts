import { Component, input, output, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';

export interface Organizer {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  eventCount: number;
  growthPercentage: number;
  trendData?: number[];
}

@Component({
  selector: 'app-top-organizers',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NgOptimizedImage],
  templateUrl: './top-organizers.component.html',
  styleUrls: ['./top-organizers.component.scss'],
})
export class TopOrganizersComponent {
  public readonly organizers = input.required<Organizer[]>();
  public readonly title = input<string>('Top Organizers');
  public readonly showViewAll = input<boolean>(true);

  public readonly viewAllClicked = output<void>();
  public readonly organizerClicked = output<Organizer>();

  public readonly hasOrganizers = computed<boolean>(
    () => this.organizers().length > 0
  );

  protected onViewAll(): void {
    this.viewAllClicked.emit();
  }

  protected onOrganizerClick(organizer: Organizer): void {
    this.organizerClicked.emit(organizer);
  }

  protected getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  protected isPositiveGrowth(percentage: number): boolean {
    return percentage > 0;
  }

  protected isNegativeGrowth(percentage: number): boolean {
    return percentage < 0;
  }

  protected formatGrowth(percentage: number): string {
    return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
  }

  protected trackByOrganizer(_index: number, organizer: Organizer): number {
    return organizer.id;
  }

  protected hasTrendData(organizer: Organizer): boolean {
    return !!organizer.trendData && organizer.trendData.length > 0;
  }

  protected getGrowthIcon(growthPercentage: number): string {
    if (growthPercentage > 0) return 'icons/graph-chart-1.png';
    if (growthPercentage < 0) return 'icons/graph-chart-2.png';
    return 'icons/graph-chart-1.png';
  }
}
