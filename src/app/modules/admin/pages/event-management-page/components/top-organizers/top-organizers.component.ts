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

  public readonly hasOrganizers = computed<boolean>(() =>
    this.hasOrganizersData()
  );

  public onViewAll(): void {
    this.emitOrganizerEvent();
  }

  public onOrganizerClick(organizer: Organizer): void {
    this.emitOrganizerEvent(organizer);
  }

  public getInitial(name: string): string {
    return this.extractInitial(name);
  }

  public isPositiveGrowth(percentage: number): boolean {
    return this.checkPositiveGrowth(percentage);
  }

  public isNegativeGrowth(percentage: number): boolean {
    return this.checkNegativeGrowth(percentage);
  }

  public formatGrowth(percentage: number): string {
    return this.formatGrowthPercentage(percentage);
  }

  public trackByOrganizer(_index: number, organizer: Organizer): number {
    return organizer.id;
  }

  public hasTrendData(organizer: Organizer): boolean {
    return this.validateTrendData(organizer);
  }

  public getGrowthIcon(growthPercentage: number): string {
    return this.selectGrowthIcon(growthPercentage);
  }

  protected hasOrganizersData(): boolean {
    return this.organizers().length > 0;
  }

  protected emitOrganizerEvent(organizer?: Organizer): void {
    if (organizer) {
      this.organizerClicked.emit(organizer);
    } else {
      this.viewAllClicked.emit();
    }
  }

  protected extractInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  protected checkPositiveGrowth(percentage: number): boolean {
    return percentage > 0;
  }

  protected checkNegativeGrowth(percentage: number): boolean {
    return percentage < 0;
  }

  protected formatGrowthPercentage(percentage: number): string {
    return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
  }

  protected validateTrendData(organizer: Organizer): boolean {
    return !!organizer.trendData && organizer.trendData.length > 0;
  }

  protected selectGrowthIcon(growthPercentage: number): string {
    if (growthPercentage > 0) return 'icons/graph-chart-1.png';
    if (growthPercentage < 0) return 'icons/graph-chart-2.png';
    return 'icons/graph-chart-1.png';
  }
}
