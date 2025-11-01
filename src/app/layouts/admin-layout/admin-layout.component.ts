import { Component, DestroyRef } from '@angular/core';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminSidebarComponent } from '../../shared/admin-ui/admin-sidebar/admin-sidebar.component';
import { AdminTopNavComponent } from '../../shared/admin-ui/admin-top-nav/admin-top-nav.component';
import { LayoutService } from '../../core/services/layout.service';
import { AdminLoginPageComponent } from "../../modules/auth/pages/admin-login-page/admin-login-page.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminSidebarComponent, AdminTopNavComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  constructor(
    public readonly layoutService: LayoutService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly destroyRef: DestroyRef
  ) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        map(() => this.getDeepestChildTitle(this.route)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((title) => this.layoutService.pageTitle.set(title));
  }

  private getDeepestChildTitle(route: ActivatedRoute): string {
    let child = route.firstChild;
    while (child?.firstChild) {
      child = child.firstChild;
    }
    return child?.snapshot.data['title'] || 'Dashboard';
  }
}
