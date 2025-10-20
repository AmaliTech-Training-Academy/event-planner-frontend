import { Component } from '@angular/core';
import { PartnersComponent } from "../../../../shared/components/partners/partners.component";
import { HeroSectionComponent } from "./components/hero-section/hero-section.component";
import { FeaturesSectionComponent } from "./components/features-section/features-section.component";
import { ConferenceSectionComponent } from "./components/conference-section/conference-section.component";
import { WhyUsSectionComponent } from "./components/why-us-section/why-us-section.component";
import { FaqSectionComponent } from "./components/faq-section/faq-section.component";

@Component({
  selector: 'app-landing-page',
  imports: [PartnersComponent, HeroSectionComponent, FeaturesSectionComponent, ConferenceSectionComponent, WhyUsSectionComponent, FaqSectionComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
