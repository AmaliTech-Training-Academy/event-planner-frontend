import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../modules/attendee/components/header/header.component";
import { FooterComponent } from "../../modules/attendee/components/footer/footer.component";

@Component({
  selector: 'app-atendee-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './atendee-layout.component.html',
  styleUrl: './atendee-layout.component.scss'
})
export class AtendeeLayoutComponent {

}
