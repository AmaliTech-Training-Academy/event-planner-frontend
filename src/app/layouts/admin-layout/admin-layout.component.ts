import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from "../../shared/admin-ui/admin-sidebar/admin-sidebar.component";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminSidebarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
