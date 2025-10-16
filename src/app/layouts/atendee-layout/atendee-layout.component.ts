import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../modules/attendee/components/header/header.component";

@Component({
  selector: 'app-atendee-layout',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './atendee-layout.component.html',
  styleUrl: './atendee-layout.component.scss'
})
export class AtendeeLayoutComponent {

}
