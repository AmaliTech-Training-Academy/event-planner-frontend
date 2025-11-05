// top-organizers.component.ts
import { Component, input, output } from '@angular/core';
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
  public organizers = input.required<Organizer[]>();
  public title = input<string>('Top Organizers');
  public showViewAll = input<boolean>(true);

  public viewAllClicked = output<void>();
  public organizerClicked = output<Organizer>();

  public onViewAll(): void {
    this.viewAllClicked.emit();
  }

  public onOrganizerClick(organizer: Organizer): void {
    this.organizerClicked.emit(organizer);
  }

  public getSparklinePoints(data: number[]): string {
    if (!data || data.length === 0) return '';

    const width = 80;
    const height = 24;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }
}
