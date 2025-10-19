import { Component } from '@angular/core';
import { PartnersComponent } from "../../../../shared/components/partners/partners.component";
import { HeroSectionComponent } from "./hero-section/hero-section.component";

@Component({
  selector: 'app-landing-page',
  imports: [PartnersComponent, HeroSectionComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
