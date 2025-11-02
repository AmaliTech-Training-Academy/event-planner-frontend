import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrafficByWebsite } from '../../../../../../core/models/dashboard.model';

@Component({
  selector: 'app-traffic-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './traffic-list.component.html',
  styleUrls: ['./traffic-list.component.scss'],
})
export class TrafficListComponent {
  @Input() public data: TrafficByWebsite[] = [];
}
