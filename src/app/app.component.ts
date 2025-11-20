import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationCardComponent } from "./shared/ui/notification-card/notification-card.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'event-planner';
  // TEST: This change is only on temporal-deploy branch for deployment testing
}
