import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { USER_ROLES } from '../../../../core/constants/user.constants';
import { User, UserCardData } from '../../../../core/models/user.model';
import { LayoutService } from '../../../../core/services/layout.service';
import { AdminUserCardComponent } from '../../../../shared/admin-ui/admin-user-card/admin-user-card.component';
import {
  DataTableComponent,
  TableAction,
  TableColumn,
  TableFilter,
} from '../../../../shared/admin-ui/data-table/data-table.component';
import { InviteUserModalComponent } from './components/invite-user-modal/invite-user-modal.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';
import { EditUserProfileComponent } from './components/edit-user-profile/edit-user-profile.component';
import { ViewUserProfileComponent } from './components/view-user-profile/view-user-profile.component';

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [
    AdminUserCardComponent,
    DataTableComponent,
    InviteUserModalComponent,
    SuccessModalComponent,
    EditUserProfileComponent,
    ViewUserProfileComponent,
  ],
  templateUrl: './user-management-page.component.html',
  styleUrls: ['./user-management-page.component.scss'],
})
export class UserManagementPageComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);
  private readonly _router = inject(Router);

  protected readonly isInviteModalOpen = signal<boolean>(false);
  protected readonly isSuccessModalOpen = signal<boolean>(false);
  protected readonly isEditModalOpen = signal<boolean>(false);
  protected readonly isViewModalOpen = signal<boolean>(false);
  protected readonly selectedUser = signal<User | null>(null);

  protected readonly userCards = signal<UserCardData[]>([
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

  private readonly _users = signal<User[]>([
    {
      userId: 'U001',
      name: 'Sarah Wilson',
      fullName: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+233501234567',
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
      phone: '+233501234567',
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
      phone: '+233501234567',
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
      phone: '+233501234567',
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
      phone: '+233501234567',
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
      userId: 'U005',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '+233501234567',
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
      userId: 'U005',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '+233501234567',
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
      userId: 'U005',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '+233501234567',
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
      userId: 'U005',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '+233501234567',
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
      userId: 'U005',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '+233501234567',
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
      userId: 'U005',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '+233501234567',
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
      userId: 'U005',
      name: 'Jessica Davis',
      fullName: 'Jessica Davis',
      email: 'jessica@example.com',
      phone: '+233501234567',
      address: '654 Maple St, Boroughville',
      avatar: 'icons/avatar.png',
      profileImageUrl: 'icons/avatar.png',
      role: USER_ROLES.ATTENDEE,
      status: 'Inactive',
      eventsOrganized: 0,
      eventsAttended: 1,
      joinedDate: '2024-01-25',
      lastActive: '2 weeks ago',
    }
    
  ]);

  protected readonly users = this._users.asReadonly();

  protected readonly tableColumns: TableColumn<User>[] = [
    { key: 'name', header: 'User', sortable: true },
    { key: 'role', header: 'Role(s)', filterable: true },
    { key: 'status', header: 'Status', filterable: true },
    { key: 'eventsOrganized', header: 'Events Organized', sortable: true },
    { key: 'eventsAttended', header: 'Events Attended', sortable: true },
  ];

  protected readonly tableActions: TableAction<User>[] = [
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

  protected readonly tableFilters: TableFilter[] = [
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

  protected readonly primaryAction = {
    label: 'Invite User',
    handler: () => this._openInviteModal(),
  };

  constructor() {
    effect(() => {
      const user = this.selectedUser();
      const isOpen = this.isEditModalOpen();
    });
  }

  ngOnInit(): void {
    this._layoutService.pageTitle.set('User Management');
  }

  protected openInviteModal(): void {
    this.isInviteModalOpen.set(true);
  }

  protected closeInviteModal(): void {
    this.isInviteModalOpen.set(false);
  }

  protected closeSuccessModal(): void {
    this.isSuccessModalOpen.set(false);
  }

  protected onInviteSuccess(): void {
    this.closeInviteModal();

    setTimeout(() => {
      this.isSuccessModalOpen.set(true);
    }, 200);
  }

  protected goToDashboard(): void {
    this.closeSuccessModal();
    this._router.navigate(['/dashboard']);
  }

  protected closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.selectedUser.set(null);
  }

  protected onEditFromView(): void {
    this.isViewModalOpen.set(false);

    Promise.resolve().then(() => {
      this.isEditModalOpen.set(true);
    });
  }

  protected onToggleUserStatus(user: User): void {
    this._toggleUserStatus(user);
    this.closeViewModal();
  }

  protected closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedUser.set(null);
  }

  protected onSaveEdit(formData: any): void {

    const selectedUserId = this.selectedUser()?.userId;
    if (!selectedUserId) {
      return;
    }

    this._users.update((users) =>
      users.map((u) => {
        if (u.userId === selectedUserId) {
          return {
            ...u,
            fullName: formData.fullName,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phoneNumber,
            address: formData.address,
            profileImageUrl: formData.profileImage || u.profileImageUrl,
            avatar: formData.profileImage || u.avatar,
          };
        }
        return u;
      })
    );

    this.closeEditModal();
  }

  protected onRowExpanded(user: User): void {
  }

  private _openInviteModal(): void {
    this.openInviteModal();
  }

  private _viewUser(user: User): void {
    this.selectedUser.set(user);

    Promise.resolve().then(() => {
      this.isViewModalOpen.set(true);
    });
  }

  private _editUser(user: User): void {

    if (this.isViewModalOpen()) {
      this.closeViewModal();
    }

    this.selectedUser.set(user);

    Promise.resolve().then(() => {
      this.isEditModalOpen.set(true);
    });
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
}
