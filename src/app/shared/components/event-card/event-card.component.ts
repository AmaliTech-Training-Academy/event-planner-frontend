// event-card.component.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EventCardData {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly location: string;
  readonly attendees: number;
  readonly imageUrl: string;
  readonly isPaid: boolean;
}

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="event-card">
      <div class="event-card__image">
        <img [src]="_event().imageUrl" [alt]="_event().title" loading="lazy" />
        <span
          class="event-card__badge"
          [class.event-card__badge--paid]="_event().isPaid"
        >
          {{ _event().isPaid ? 'Paid' : 'Free' }}
        </span>
      </div>

      <div class="event-card__content">
        <div class="event-card__date">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect
              x="2"
              y="3"
              width="12"
              height="11"
              rx="2"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M11 1.5V4.5M5 1.5V4.5M2 7H14"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          <span>{{ _event().date }}</span>
        </div>

        <h3 class="event-card__title">{{ _event().title }}</h3>

        <div class="event-card__info">
          <div class="event-card__info-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 7C8.38071 7 9.5 5.88071 9.5 4.5C9.5 3.11929 8.38071 2 7 2C5.61929 2 4.5 3.11929 4.5 4.5C4.5 5.88071 5.61929 7 7 7Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M7 12C9 9.5 12 8 12 5C12 2.5 9.5 1 7 1C4.5 1 2 2.5 2 5C2 8 5 9.5 7 12Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
            <span>{{ _event().location }}</span>
          </div>

          <div class="event-card__info-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle
                cx="9"
                cy="9"
                r="3"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <circle
                cx="5"
                cy="3"
                r="2.5"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
            <span>{{ _event().attendees }} attendees</span>
          </div>
        </div>

        <button
          class="event-card__button"
          (click)="_onViewDetails()"
          type="button"
        >
          View Details
        </button>
      </div>
    </article>
  `,
  styleUrls: ['./event-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  protected readonly _event = input.required<EventCardData>({ alias: 'event' });
  public readonly viewDetails = output<string>();

  protected _onViewDetails(): void {
    this.viewDetails.emit(this._event().id);
  }
}
