import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-event-date',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-event-date.component.html',
  styleUrl: './create-event-date.component.scss'
})
export class CreateEventDateComponent {

  protected currentValue:string = "";

  @Input() icon: string = "";
  @Input() title: string = "";
@Input() control!: FormControl;
  @Output() clicked = new EventEmitter<void>();


  constructor(){
    
  }

  private selectedState: boolean = false;

  protected clickedOn() {
    this.selectedState = !this.selectedState;
    this.clicked.emit()
  }


}
