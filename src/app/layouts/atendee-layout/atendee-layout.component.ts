import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { PartnersComponent } from "../../shared/components/partners/partners.component";

@Component({
  selector: 'app-atendee-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, PartnersComponent],
  templateUrl: './atendee-layout.component.html',
  styleUrl: './atendee-layout.component.scss'
})
export class AtendeeLayoutComponent {

}
