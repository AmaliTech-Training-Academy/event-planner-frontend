// user-management-page.component.ts
import { Component, signal, inject } from '@angular/core';
import { AdminUserCardComponent } from '../../../../shared/admin-ui/admin-user-card/admin-user-card.component';
import { LayoutService } from '../../../../core/services/layout.service';
import {
  DataTableComponent,
  TableColumn,
  TableAction,
  TableFilter,
} from '../../../../shared/admin-ui/data-table/data-table.component';
import { User, UserCardData } from '../../../../core/models/user.model';
import { USER_ROLES } from '../../../../core/constants/user.constants';

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [AdminUserCardComponent, DataTableComponent],
  templateUrl: './user-management-page.component.html',
  styleUrls: ['./user-management-page.component.scss'],
})
export class UserManagementPageComponent {
  private _layoutService = inject(LayoutService);

  public readonly userCards = signal<UserCardData[]>([
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

  private _users = signal<User[]>([
    {
      userId: 'U001',
      name: 'Sarah Wilson',
      fullName: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '123-456-7890',
      address: '123 Main St, Cityville',
      avatar: 'icons/avatar.png',
      profileImageUrl: 'icons/avatar.png',
      role: USER_ROLES.ORGANIZER,
      status: 'Active',
      eventsOrganized: 3,
      eventsAttended: 10,
      joinedDate: '2024-01-15',
      lastActive: '2 hours ago',
    },
    {
      userId: 'U002',
      name: 'John Smith',
      fullName: 'John Smith',
      email: 'john@example.com',
      phone: '234-567-8901',
      address: '456 Elm St, Townsville',
      avatar: 'icons/avatar.png',
      profileImageUrl: 'icons/avatar.png',
      role: USER_ROLES.ATTENDEE,
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 2,
      joinedDate: '2024-02-20',
      lastActive: '5 days ago',
    },
    {
      userId: 'U003',
      name: 'Emily Johnson',
      fullName: 'Emily Johnson',
      email: 'emily@example.com',
      phone: '345-678-9012',
      address: '789 Oak St, Villageville',
      avatar: 'icons/avatar.png',
      profileImageUrl: 'icons/avatar.png',
      role: USER_ROLES.CO_ORGANIZER,
      status: 'Active',
      eventsOrganized: 2,
      eventsAttended: 6,
      joinedDate: '2024-03-10',
      lastActive: '1 hour ago',
    },
    {
      userId: 'U004',
      name: 'Michael Brown',
      fullName: 'Michael Brown',
      email: 'michael@example.com',
      phone: '456-789-0123',
      address: '321 Pine St, Hamletville',
      avatar: 'icons/avatar.png',
      profileImageUrl: 'icons/avatar.png',
      role: USER_ROLES.VENUE_STAFF,
      status: 'Active',
      eventsOrganized: 0,
      eventsAttended: 8,
      joinedDate: '2023-12-05',
      lastActive: '30 minutes ago',
    },
    {
      userId: 'U005',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '567-890-1234',
      address: '654 Maple St, Boroughville',
      avatar: 'icons/avatar.png',
      profileImageUrl: 'icons/avatar.png',
      role: USER_ROLES.ATTENDEE,
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
    {
      userId: 'U006',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '567-890-1234',
      address: '654 Maple St, Boroughville',
      avatar: 'icons/avatar.png',
      profileImageUrl: 'icons/avatar.png',
      role: USER_ROLES.ATTENDEE,
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
    {
      userId: 'U007',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '567-890-1234',
      address: '654 Maple St, Boroughville',
      avatar: 'icons/avatar.png',
      profileImageUrl: 'icons/avatar.png',
      role: USER_ROLES.ATTENDEE,
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
    {
      userId: 'U008',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '567-890-1234',
      address: '654 Maple St, Boroughville',
      avatar: 'icons/avatar.png',
      profileImageUrl: 'icons/avatar.png',
      role: USER_ROLES.ATTENDEE,
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
    {
      userId: 'U009',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '567-890-1234',
      address: '654 Maple St, Boroughville',
      avatar: 'icons/avatar.png',
      profileImageUrl: 'icons/avatar.png',
      role: USER_ROLES.ATTENDEE,
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
    {
      userId: 'U010',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '567-890-1234',
      address: '654 Maple St, Boroughville',
      avatar: 'icons/avatar.png',
      profileImageUrl: 'icons/avatar.png',
      role: USER_ROLES.ATTENDEE,
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    },
    {
      userId: 'U011',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '567-890-1234',
      address: '654 Maple St, Boroughville',
      avatar: 'icons/avatar.png',
      profileImageUrl: 'icons/avatar.png',
      role: USER_ROLES.ATTENDEE,
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
        { label: USER_ROLES.ORGANIZER, value: USER_ROLES.ORGANIZER },
        { label: USER_ROLES.CO_ORGANIZER, value: USER_ROLES.CO_ORGANIZER },
        { label: USER_ROLES.ATTENDEE, value: USER_ROLES.ATTENDEE },
        { label: USER_ROLES.VENUE_STAFF, value: USER_ROLES.VENUE_STAFF },
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
    this._users.update((users) =>
      users.map((u) =>
        u.userId === user.userId
          ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
          : u
      )
    );
  }

  private _inviteUser(): void {}

  public onRowExpanded(user: User): void {}
}
