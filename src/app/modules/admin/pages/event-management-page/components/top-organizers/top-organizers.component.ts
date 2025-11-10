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
    this._hasOrganizersData()
  );

  public onViewAll(): void {
    this.viewAllClicked.emit();
  }

  public onOrganizerClick(organizer: Organizer): void {
    this._emitOrganizerEvent(organizer);
  }

  public getInitial(name: string): string {
    return this._extractInitial(name);
  }

  public isPositiveGrowth(percentage: number): boolean {
    return this._checkPositiveGrowth(percentage);
  }

  public isNegativeGrowth(percentage: number): boolean {
    return this._checkNegativeGrowth(percentage);
  }

  public formatGrowth(percentage: number): string {
    return this._formatGrowthPercentage(percentage);
  }

  public trackByOrganizer(_index: number, organizer: Organizer): number {
    return organizer.id;
  }

  public hasTrendData(organizer: Organizer): boolean {
    return this._validateTrendData(organizer);
  }

  public getGrowthIcon(growthPercentage: number): string {
    return this._selectGrowthIcon(growthPercentage);
  }

  private _hasOrganizersData(): boolean {
    return this.organizers().length > 0;
  }

  private _emitOrganizerEvent(organizer: Organizer): void {
    this.organizerClicked.emit(organizer);
  }

  private _extractInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  private _checkPositiveGrowth(percentage: number): boolean {
    return percentage > 0;
  }

  private _checkNegativeGrowth(percentage: number): boolean {
    return percentage < 0;
  }

  private _formatGrowthPercentage(percentage: number): string {
    return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
  }

  private _validateTrendData(organizer: Organizer): boolean {
    return !!organizer.trendData && organizer.trendData.length > 0;
  }

  private _selectGrowthIcon(growthPercentage: number): string {
    if (growthPercentage > 0) return 'icons/graph-chart-1.png';
    if (growthPercentage < 0) return 'icons/graph-chart-2.png';
    return 'icons/graph-chart-1.png';
  }
}
