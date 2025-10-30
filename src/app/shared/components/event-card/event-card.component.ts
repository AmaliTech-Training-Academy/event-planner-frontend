import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss', 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCardComponent {
  @Input() public imageUrl: string = '';
  @Input() public date: string = '';
  @Input() public title: string = '';
  @Input() public location: string = '';
  @Input() public attendees: number = 0;
  @Input() public isPaid: boolean = false;
}