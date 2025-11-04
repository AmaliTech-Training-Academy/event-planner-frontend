import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-filter-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-button.component.html',
  styleUrl: './filter-button.component.scss'
})
export class FilterButtonComponent {

  
  @Input() public text: string = '';

  @Input() public iconPath: string = '';

  @Input() public isPlaceholder: boolean = false;

}

