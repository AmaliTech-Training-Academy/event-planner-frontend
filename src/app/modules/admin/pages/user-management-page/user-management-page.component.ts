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
import { UpdateUserPayload } from '../../../../core/services/backend/user-backend.service';

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

  protected readonly isInviteModalOpen = signal<boolean>(false);
  protected readonly isSuccessModalOpen = signal<boolean>(false);
  protected readonly isEditModalOpen = signal<boolean>(false);
  protected readonly isViewModalOpen = signal<boolean>(false);
  protected readonly selectedUser = signal<User | null>(null);

  protected readonly togglingUserId = signal<number | string | null>(null);

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
      isLoading: (user) => this.togglingUserId() === user.userId,
    },
  ];

  protected readonly tableFilters: TableFilter[] = [
    {
      key: 'role',
      placeholder: 'All Roles',
      options: [
        { label: 'Organizer', value: USER_ROLES.ORGANIZER }, // 'ORGANISER'
        { label: 'Co-Organizer', value: USER_ROLES.CO_ORGANIZER },
        { label: 'Attendee', value: USER_ROLES.ATTENDEE },
        { label: 'Admin', value: USER_ROLES.ADMIN },
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
    });
  }

  ngOnInit(): void {
    this._layoutService.pageTitle.set('User Management');
    this._loadUsers();
  }

  private _loadUsers(page: number = 0): void {
    this._userService
      .fetchAllUsers(page)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  public onPageChange(page: number): void {
    this._loadUsers(page - 1); // ✅ keep it consistent
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

    // ✅ Build UpdateUserPayload matching backend format
    const updatePayload: UpdateUserPayload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || formData.phoneNumber || '',
      address: formData.address || '',
      status: selectedUser.status === 'Active', // ✅ Convert to boolean
    };

    // Add profile picture if provided
    if (formData.profileImage) {
      updatePayload.profilePicture = formData.profileImage;
    }

    this._userService
      .updateUser(selectedUser.userId.toString(), updatePayload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.closeEditModal();
          this._loadUsers(this.currentPage() || 0);
        },
        error: (error) => {
          console.error('Failed to update user:', error);
          alert('Failed to update user. Please try again.');
        },
      });
  }
  protected onRowExpanded(user: User): void {}

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

    Promise.resolve().then(() => {
      this.selectedUser.set(user);
      this.isEditModalOpen.set(true);
    });
  }

  private _toggleUserStatus(user: User): void {
    this.togglingUserId.set(user.userId);

    this._userService
      .toggleUserStatusWithBackend(user.userId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          console.log(
            user.status === 'Active'
              ? '✅ User deactivated successfully'
              : '✅ User reactivated successfully'
          );
          this.togglingUserId.set(null);
        },
        error: (err) => {
          console.error('❌ Failed to toggle user status:', err);
          this.togglingUserId.set(null);
        },
      });
  }
}
