import {
  Component,
  OnInit,
  effect,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { USER_ROLES } from '../../../../core/constants/user.constants';
import {
  User,
  UserCardData,
  mapUserStatus,
} from '../../../../core/models/user.model';
import { LayoutService } from '../../../../core/services/layout.service';
import { UserManagementService } from '../../../../core/services/user-management.service';
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
  private readonly _userService = inject(UserManagementService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  // Modal state signals
  protected readonly isInviteModalOpen = signal<boolean>(false);
  protected readonly isSuccessModalOpen = signal<boolean>(false);
  protected readonly isEditModalOpen = signal<boolean>(false);
  protected readonly isViewModalOpen = signal<boolean>(false);
  protected readonly selectedUser = signal<User | null>(null);

  // Convert observables to signals
  protected readonly userCards = toSignal(this._userService.userCards$, {
    initialValue: [],
  });

  protected readonly users = toSignal(this._userService.users$, {
    initialValue: [],
  });

  protected readonly loading = toSignal(this._userService.loading$, {
    initialValue: false,
  });

  protected readonly totalPages = toSignal(this._userService.totalPages$, {
    initialValue: 1,
  });

  protected readonly currentPage = toSignal(this._userService.currentPage$, {
    initialValue: 0,
  });

  // Table configuration
  protected readonly tableColumns: TableColumn<User>[] = [
    {
      key: 'fullName',
      header: 'User',
      sortable: true,
      getValue: (user) => user.fullName || user.name || 'N/A',
    },
    {
      key: 'role',
      header: 'Role(s)',
      filterable: true,
      getValue: (user) => user.role,
    },
    {
      key: 'status',
      header: 'Status',
      filterable: true,
      getValue: (user) =>
        typeof user.status === 'boolean'
          ? mapUserStatus(user.status)
          : user.status,
    },
    {
      key: 'eventsOrganized',
      header: 'Events Organized',
      sortable: true,
    },
    {
      key: 'eventsAttended',
      header: 'Events Attended',
      sortable: true,
    },
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
        { label: 'Organizer', value: USER_ROLES.ORGANIZER },
        { label: 'Co-Organizer', value: USER_ROLES.CO_ORGANIZER },
        { label: 'Attendee', value: USER_ROLES.ATTENDEE },
        { label: 'Venue Staff', value: USER_ROLES.VENUE_STAFF },
      ],
    },
    {
      key: 'status',
      placeholder: 'All Status',
      options: [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' },
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
      // Add any side effects here if needed
    });
  }

  ngOnInit(): void {
    this._layoutService.pageTitle.set('User Management');
    this._loadUsers();
  }

  // Data loading
  private _loadUsers(page: number = 0): void {
    this._userService
      .fetchAllUsers(page)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  public onPageChange(page: number): void {
    this._loadUsers(page);
  }

  // Modal handlers
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
    // Reload users to show the new invite
    this._loadUsers(this.currentPage() || 0);

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
    const selectedUser = this.selectedUser();
    if (!selectedUser?.userId) {
      return;
    }

    const updatePayload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phoneNumber,
      address: formData.address,
      profileImageUrl: formData.profileImage || selectedUser.profileImageUrl,
    };

    this._userService
      .updateUser(selectedUser.userId.toString(), updatePayload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.closeEditModal();
          // Reload current page to show updated data
          this._loadUsers(this.currentPage() || 0);
        },
        error: (error) => {
          console.error('Failed to update user:', error);
          // Error is handled by ErrorHandlerService
        },
      });
  }

  protected onRowExpanded(user: User): void {
    // Handle row expansion if needed
  }

  // Private action handlers
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

    this.selectedUser.set(null); // reset any previous signal
    Promise.resolve().then(() => {
      this.selectedUser.set(user);
      this.isEditModalOpen.set(true);
    });
  }

  private _toggleUserStatus(user: User): void {
    const normalizedStatus =
      typeof user.status === 'boolean'
        ? user.status
          ? 'Active'
          : 'Inactive'
        : user.status;
    const isCurrentlyActive = normalizedStatus === 'Active';

    this._userService
      .deactivateUser(user.userId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          // ✅ Only toggle locally after backend success
          this._userService.toggleUserStatus(user.userId);

          console.log(
            isCurrentlyActive
              ? '✅ User deactivated successfully'
              : '✅ User reactivated successfully'
          );
        },
        error: (err) => {
          console.error('❌ Failed to toggle user status:', err);
        },
      });
  }
}
