import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { StatCardData } from '../../../core/models/event.model'; 

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  public data = input.required<StatCardData>();

  
  protected isString(val: any): val is string {
    return typeof val === 'string';
  }
}