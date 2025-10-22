import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-ui/admin-sidebar/admin-sidebar.component';
import { AdminTopNavComponent } from '../../shared/admin-ui/admin-top-nav/admin-top-nav.component';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminSidebarComponent, AdminTopNavComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  constructor(
    public layoutService: LayoutService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.route.firstChild;
          while (child?.firstChild) child = child.firstChild;
          return child?.snapshot.data['title'] || 'Dashboard';
        })
      )
      .subscribe((title) => this.layoutService.pageTitle.set(title));
  }
}
