import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { PartnersComponent } from "../../../../shared/components/partners/partners.component";
import { ABOUT_MISSIONS, ABOUT_OUR_STORY, ABOUT_TEAM_MEMBERS } from './constants/about.constant';
import { SteperComponent } from "./components/steper/steper.component";
import { TeamComponent } from "./components/team/team.component";
import { MissionComponent } from "./components/mission/mission.component";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";

@Component({
  selector: 'app-about-page',
  imports: [RouterModule, PartnersComponent, SteperComponent, TeamComponent, MissionComponent, ButtonComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss'
})
export class AboutPageComponent {

  constructor(private readonly router: Router) { }
  protected readonly APP_ROUTE = APP_ROUTES;

  protected goTo(path: string) {
    this.router.navigate([path])
  }

}
