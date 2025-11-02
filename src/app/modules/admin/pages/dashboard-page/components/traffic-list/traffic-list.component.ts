import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrafficByWebsite } from '../../../../../../core/models/dashboard.model';

@Component({
  selector: 'app-traffic-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="traffic-list">
      @for (item of data; track item.website) {
      <div class="traffic-item">
        <span class="traffic-item__label">{{ item.website }}</span>
        <div class="traffic-item__bar">
          <div
            class="traffic-item__progress"
            [style.width.%]="item.percentage"
            [style.background-color]="item.color"
          ></div>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      @use 'colors' as *;
      @use 'typography' as *;
      @use 'variables' as *;

      .traffic-list {
        display: flex;
        flex-direction: column;
        gap: $spacing-5;
      }

      .traffic-item {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;

        &__label {
          @include body-2;
          color: $gray-700;
          font-weight: 500;
        }

        &__bar {
          width: 100%;
          height: 8px;
          background: $gray-100;
          border-radius: $radius-2;
          overflow: hidden;
        }

        &__progress {
          height: 100%;
          border-radius: $radius-2;
          transition: width 0.6s ease;
        }
      }
    `,
  ],
})
export class TrafficListComponent {
  @Input() data: TrafficByWebsite[] = [];
}
