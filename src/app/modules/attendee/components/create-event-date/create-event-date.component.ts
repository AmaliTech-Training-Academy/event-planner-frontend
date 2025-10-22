import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-create-event-date',
  imports: [],
  templateUrl: './create-event-date.component.html',
  styleUrl: './create-event-date.component.scss'
})
export class CreateEventDateComponent {

  @Input() icon: string = "";
  @Input() title: string = "";
  @Output() clicked = new EventEmitter<boolean>();

  private selectedState: boolean = false;

  protected clickedOn() {
    this.selectedState = !this.selectedState;
    this.clicked.emit(this.selectedState)
  }


}
