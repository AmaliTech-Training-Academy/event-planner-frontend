import { Component } from '@angular/core';
import { ABOUT_MISSIONS } from '../../constants/about.constant';

@Component({
  selector: 'app-mission',
  imports: [],
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.scss'
})
export class MissionComponent {
  protected readonly missions = ABOUT_MISSIONS;

}
