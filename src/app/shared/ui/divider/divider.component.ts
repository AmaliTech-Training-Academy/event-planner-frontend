import { Component, input } from '@angular/core';

@Component({
  selector: 'app-divider',
  standalone: true,
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
})
export class DividerComponent {
 
  public readonly text = input<string | null>('or');


  public readonly decorative = input<boolean>(false);
}
