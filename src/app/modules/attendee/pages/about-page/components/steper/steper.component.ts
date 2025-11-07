import { Component } from '@angular/core';
import { ABOUT_OUR_STORY } from '../../constants/about.constant';

@Component({
  selector: 'app-steper',
  imports: [],
  templateUrl: './steper.component.html',
  styleUrl: './steper.component.scss'
})
export class SteperComponent {
  protected readonly ourStory = ABOUT_OUR_STORY;

}
