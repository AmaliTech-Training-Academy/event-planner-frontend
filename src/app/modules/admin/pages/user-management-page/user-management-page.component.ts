// user-management-page.component.ts
import { Component, signal, inject } from '@angular/core';
import {
  AdminUserCardComponent,
  UserCardData,
} from '../../../../shared/admin-ui/admin-user-card/admin-user-card.component';
import { LayoutService } from '../../../../core/services/layout.service';
import {
  DataTableComponent,
  TableColumn,
  TableAction,
  TableFilter,
} from '../../../../shared/admin-ui/data-table/data-table.component';
import { PaginationComponent } from "../../../../shared/admin-ui/pagination/pagination.component";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: string;
  eventsOrganized: number;
  eventsAttended: number;
  joinedDate: string;
  lastActive: string;
}

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [AdminUserCardComponent, DataTableComponent, PaginationComponent],
  templateUrl: './user-management-page.component.html',
  styleUrls: ['./user-management-page.component.scss'],
})
export class UserManagementPageComponent {
  private _layoutService = inject(LayoutService);

  // User overview cards
  public userCards = signal<UserCardData[]>([
    {
      title: 'Total Users',
      count: 2593,
      percentageChange: 11.01,
      icon: 'icons/user-icon-orange.png',
      bgColor: '#FFF4ED',
      iconColor: '#FF6B2C',
    },
    {
      title: 'Active Organizers',
      count: 156,
      icon: 'icons/user-icon-green.png',
      bgColor: '#E8F5E9',
      iconColor: '#4CAF50',
    },
    {
      title: 'Attendees',
      count: 2387,
      icon: 'icons/user-icon-blue.png',
      bgColor: '#E3F2FD',
      iconColor: '#2196F3',
    },
    {
      title: 'Deactivated',
      count: 24,
      icon: 'icons/user-icon-red.png',
      bgColor: '#FFEBEE',
      iconColor: '#F44336',
    },
  ]);

  // User data
  private _users = signal<User[]>([
    {
      id: 1,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: 'icons/avatar.png',
      role: 'Organizer',
      status: 'Active',
      eventsOrganized: 3,
      eventsAttended: 10,
      joinedDate: '2024-01-15',
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'John Smith',
      email: 'john@example.com',
      avatar: 'icons/avatar.png',
      role: 'Attendee',
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 2,
      joinedDate: '2024-02-20',
      lastActive: '5 days ago',
    },
    {
      id: 3,
      name: 'Emily Johnson',
      email: 'emily@example.com',
      avatar: 'icons/avatar.png',
      role: 'Co-Organizer',
      status: 'Active',
      eventsOrganized: 2,
      eventsAttended: 6,
      joinedDate: '2024-03-10',
      lastActive: '1 hour ago',
    },
    {
      id: 4,
      name: 'Michael Brown',
      email: 'michael@example.com',
      avatar: 'icons/avatar.png',
      role: 'Venue Staff',
      status: 'Active',
      eventsOrganized: 0,
      eventsAttended: 8,
      joinedDate: '2023-12-05',
      lastActive: '30 minutes ago',
    },
    {
      id: 5,
      name: 'Jessica Davis',
      email: 'jessica@example.com',
      avatar: 'icons/avatar.png',
      role: 'Attendee',
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
    {
      id: 6,
      name: 'Jessica Davis',
      email: 'jessica@example.com',
      avatar: 'icons/avatar.png',
      role: 'Attendee',
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
    {
      id: 7,
      name: 'Jessica Davis',
      email: 'jessica@example.com',
      avatar: 'icons/avatar.png',
      role: 'Attendee',
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
    {
      id: 8,
      name: 'Jessica Davis',
      email: 'jessica@example.com',
      avatar: 'icons/avatar.png',
      role: 'Attendee',
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
    {
      id: 9,
      name: 'Jessica Davis',
      email: 'jessica@example.com',
      avatar: 'icons/avatar.png',
      role: 'Attendee',
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
    {
      id: 10,
      name: 'Jessica Davis',
      email: 'jessica@example.com',
      avatar: 'icons/avatar.png',
      role: 'Attendee',
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
    {
      id: 11,
      name: 'Jessica Davis',
      email: 'jessica@example.com',
      avatar: 'icons/avatar.png',
      role: 'Attendee',
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
  ]);

  public users = this._users.asReadonly();

  // Table columns
  public tableColumns: TableColumn<User>[] = [
    { key: 'name', header: 'User', sortable: true },
    { key: 'role', header: 'Role(s)', filterable: true },
    { key: 'status', header: 'Status', filterable: true },
    { key: 'eventsOrganized', header: 'Events Organized', sortable: true },
    { key: 'eventsAttended', header: 'Events Attended', sortable: true },
  ];

  // Table actions
  public tableActions: TableAction<User>[] = [
    {
      icon: 'icons/view-icon.png',
      label: 'View User Details',
      color: 'view',
      handler: (user) => this._viewUser(user),
    },
    {
      icon: 'icons/edit-icon.png',
      label: 'Edit User',
      color: 'edit',
      handler: (user) => this._editUser(user),
    },
    {
      icon: 'icons/power-red.png',
      label: 'Toggle User Status',
      color: 'power',
      handler: (user) => this._toggleUserStatus(user),
    },
  ];

  // Table filters
  public tableFilters: TableFilter[] = [
    {
      key: 'role',
      placeholder: 'All Roles',
      options: [
        { label: 'Organizer', value: 'Organizer' },
        { label: 'Co-Organizer', value: 'Co-Organizer' },
        { label: 'Attendee', value: 'Attendee' },
        { label: 'Venue Staff', value: 'Venue Staff' },
      ],
    },
    {
      key: 'status',
      placeholder: 'All Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
      ],
    },
  ];

  public primaryAction = {
    label: 'Invite User',
    handler: () => this._inviteUser(),
  };

  ngOnInit(): void {
    this._layoutService.pageTitle.set('User Management');
  }

  private _viewUser(user: User): void {
    console.log('Viewing user:', user);
  }

  private _editUser(user: User): void {
    console.log('Editing user:', user);
  }

  private _toggleUserStatus(user: User): void {
    const users = this._users();
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      const updatedUsers = [...users];
      const currentStatus = updatedUsers[index].status;
      updatedUsers[index] = {
        ...updatedUsers[index],
        status: currentStatus === 'Active' ? 'Inactive' : 'Active',
      };
      this._users.set(updatedUsers);
      console.log(`User ${user.name} is now ${updatedUsers[index].status}`);
    }
  }

  private _inviteUser(): void {
    console.log('Inviting new user...');
  }

  public onRowExpanded(user: User): void {
    console.log('Expanded user row:', user);
  }
}
