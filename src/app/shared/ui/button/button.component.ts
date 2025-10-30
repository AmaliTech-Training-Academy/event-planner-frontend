

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']  
})


export class ButtonComponent {
public disabled = input<boolean>(false); 
public fullWidth = input<boolean>(false); 
public type = input<'primary' | 'social'>('primary'); 
}