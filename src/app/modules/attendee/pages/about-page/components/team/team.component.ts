import { Component } from '@angular/core';
import { ABOUT_TEAM_MEMBERS } from '../../constants/about.constant';

@Component({
  selector: 'app-team',
  imports: [],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {
  protected readonly teamMembers = ABOUT_TEAM_MEMBERS;

}
