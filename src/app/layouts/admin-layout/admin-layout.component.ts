import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminLoginPageComponent } from "../../modules/auth/pages/admin-login-page/admin-login-page.component";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminLoginPageComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
