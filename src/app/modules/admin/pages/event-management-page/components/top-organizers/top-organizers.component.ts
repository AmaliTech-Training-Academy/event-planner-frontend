import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './top-organizers.component.html',
  styleUrls: ['./top-organizers.component.scss'],
})
export class TopOrganizersComponent {
  // Inputs
  public organizers = input.required<Organizer[]>();
  public title = input<string>('Top Organizers');
  public showViewAll = input<boolean>(true);

  // Outputs
  public viewAllClicked = output<void>();
  public organizerClicked = output<Organizer>();

  // Constants
  private readonly _SPARKLINE_WIDTH = 80;
  private readonly _SPARKLINE_HEIGHT = 24;
  private readonly _SPARKLINE_STROKE_WIDTH = 2;

  // Computed
  public hasOrganizers = computed<boolean>(() => this.organizers().length > 0);

  /**
   * Handles view all button click
   */
  public onViewAll(): void {
    this.viewAllClicked.emit();
  }

  /**
   * Handles organizer card click
   */
  public onOrganizerClick(organizer: Organizer): void {
    this.organizerClicked.emit(organizer);
  }

  /**
   * Gets the first initial from organizer name for avatar fallback
   */
  public getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  /**
   * Generates SVG polyline points for sparkline chart
   */
  public getSparklinePoints(data: number[]): string {
    if (!data || data.length === 0) {
      return '';
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * this._SPARKLINE_WIDTH;
        const y =
          this._SPARKLINE_HEIGHT -
          ((value - min) / range) * this._SPARKLINE_HEIGHT;
        return `${x},${y}`;
      })
      .join(' ');
  }

  /**
   * Determines if growth percentage is positive
   */
  public isPositiveGrowth(percentage: number): boolean {
    return percentage > 0;
  }

  /**
   * Determines if growth percentage is negative
   */
  public isNegativeGrowth(percentage: number): boolean {
    return percentage < 0;
  }

  /**
   * Formats growth percentage with sign
   */
  public formatGrowth(percentage: number): string {
    return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
  }

  /**
   * TrackBy function for performance optimization
   */
  public trackByOrganizer(_index: number, organizer: Organizer): number {
    return organizer.id;
  }

  /**
   * Checks if organizer has trend data
   */
  public hasTrendData(organizer: Organizer): boolean {
    return !!organizer.trendData && organizer.trendData.length > 0;
  }
}
