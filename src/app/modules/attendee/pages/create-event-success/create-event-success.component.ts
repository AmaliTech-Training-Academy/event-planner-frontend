import { Component } from '@angular/core';
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-create-event-success',
  imports: [ButtonComponent, NgOptimizedImage],
  templateUrl: './create-event-success.component.html',
  styleUrl: './create-event-success.component.scss'
})
export class CreateEventSuccessComponent {

}
