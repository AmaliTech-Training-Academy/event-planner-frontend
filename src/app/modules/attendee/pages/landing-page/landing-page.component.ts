import { Component } from '@angular/core';
import { PartnersComponent } from "../../../../shared/components/partners/partners.component";
import { HeroSectionComponent } from "./components/hero-section/hero-section.component";
import { FeaturesSectionComponent } from "./components/features-section/features-section.component";
import { ConferenceSectionComponent } from "./components/conference-section/conference-section.component";

@Component({
  selector: 'app-landing-page',
  imports: [PartnersComponent, HeroSectionComponent, FeaturesSectionComponent, ConferenceSectionComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
