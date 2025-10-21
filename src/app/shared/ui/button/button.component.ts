

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']  
})


export class ButtonComponent {
  disabled = input<boolean>(false); 
fullWidth = input<boolean>(false); 
type = input<'primary' | 'social'>('primary'); 
}