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
  imports: [AdminUserCardComponent, DataTableComponent],
  templateUrl: './user-management-page.component.html',
  styleUrls: ['./user-management-page.component.scss'],
})
export class UserManagementPageComponent {
  private _layoutService = inject(LayoutService);

  // Reactive signal array for user cards matching the design
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
      percentageChange: undefined,
      icon: 'icons/user-icon-green.png',
      bgColor: '#E8F5E9',
      iconColor: '#4CAF50',
    },
    {
      title: 'Attendees',
      count: 2387,
      percentageChange: undefined,
      icon: 'icons/user-icon-blue.png',
      bgColor: '#E3F2FD',
      iconColor: '#2196F3',
    },
    {
      title: 'Deactivated',
      count: 24,
      percentageChange: undefined,
      icon: 'icons/user-icon-red.png',
      bgColor: '#FFEBEE',
      iconColor: '#F44336',
    },
  ]);

  // User data signal
  private _users = signal<User[]>([
    {
      id: 1,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: 'icons/avatar.png',
      role: 'Organizer',
      status: 'Active',
      eventsOrganized: 1,
      eventsAttended: 1,
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
      eventsAttended: 0,
      joinedDate: '2024-02-20',
      lastActive: '5 days ago',
    },
    {
      id: 3,
      name: 'Emily Johnson',
      email: 'emily@example.com',
      avatar: 'icons/avatar.png',

      role: 'Attendee',
      status: 'Active',
      eventsOrganized: 0,
      eventsAttended: 5,
      joinedDate: '2024-03-10',
      lastActive: '1 hour ago',
    },
    {
      id: 4,
      name: 'Michael Brown',
      email: 'michael@example.com',
      avatar: 'icons/avatar.png',

      role: 'Organizer',
      status: 'Active',
      eventsOrganized: 3,
      eventsAttended: 2,
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
  ]);

  public users = this._users.asReadonly();

  // Table column configuration
  public tableColumns: TableColumn<User>[] = [
    { key: 'name', header: 'User', sortable: true },
    { key: 'role', header: 'Role(s)', filterable: true },
    { key: 'status', header: 'Status', filterable: true },
    { key: 'eventsOrganized', header: 'Events Organized', sortable: true },
    { key: 'eventsAttended', header: 'Events Attended', sortable: true },
  ];

  // Table actions configuration
  public tableActions: TableAction<User>[] = [
    {
      icon: 'icons/view-icon.png',
      label: 'View User Details',
      color: 'view',
      handler: (user) => this._viewUser(user),
      type: 'primary',
      
    },
    {
      icon: 'icons/edit-icon.png',
      label: 'Edit User',
      color: 'edit',
      handler: (user) => this._editUser(user),
      type: 'social',
    },
    {
      icon: 'icons/delete-icon.png',
      label: 'Toggle Status',
      color: 'toggle',
      handler: (user) => this._toggleUserStatus(user),
      visible: (user) => user.status === 'Active',
      type: 'social',
    },
  ];

  // Table filters configuration
  public tableFilters: TableFilter[] = [
    {
      key: 'role',
      placeholder: 'All Roles',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Manager', value: 'manager' },
      ],
    },
    {
      key: 'status',
      placeholder: 'All Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' },
      ],
    },
  ];

  // Primary action configuration
  public primaryAction = {
    label: 'Invite User',
    handler: () => this._inviteUser(),
  };

  ngOnInit(): void {
    // Update page title via LayoutService
    this._layoutService.pageTitle.set('User Management');
  }

  // Private action handlers
  private _viewUser(user: User): void {
    console.log('Viewing user:', user);
    // TODO: Navigate to user detail page or open modal
    // this._router.navigate(['/admin/users', user.id]);
  }

  private _editUser(user: User): void {
    console.log('Editing user:', user);
    // TODO: Open edit user modal or navigate to edit page
    // this._modalService.openEditUserModal(user);
  }

  private _toggleUserStatus(user: User): void {
    const users = this._users();
    const index = users.findIndex((u) => u.id === user.id);

    if (index !== -1) {
      const updatedUsers = [...users];
      updatedUsers[index] = {
        ...updatedUsers[index],
        status: updatedUsers[index].status === 'Active' ? 'Inactive' : 'Active',
      };
      this._users.set(updatedUsers);

      // TODO: Call API to update user status
      console.log(
        `User ${user.name} status toggled to ${updatedUsers[index].status}`
      );
    }
  }

  private _inviteUser(): void {
    // TODO: Open invite user modal
    // this._modalService.openInviteUserModal();
  }

  // Public method for handling row expansion (optional)
  public onRowExpanded(user: User): void {
    // TODO: Load additional user data if needed
  }
}
