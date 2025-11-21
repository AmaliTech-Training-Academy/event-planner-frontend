import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { StatCardData } from '@app/core/models/event.model';
import { EventAnalyticsData } from '@app/core/models/manage-events';
import { StatCardComponent } from "@app/shared/components/stat-card/stat-card.component";
import { ButtonComponent } from "@app/shared/ui/button/button.component";

@Component({
  selector: 'app-overview',
  imports: [CommonModule, StatCardComponent,NgOptimizedImage],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  public overview = input.required<EventAnalyticsData|null>()
  public readonly  statCards = input.required<readonly StatCardData[]>()
  public viewGuest = output<void>()


  protected getStatusClass(status: string): string {
    if (!status) return 'event-status';
    return `event-status event-status--${status.toLowerCase()}`;
  }

  protected onViewAllGuests() {
    this.viewGuest.emit()
  }
}
