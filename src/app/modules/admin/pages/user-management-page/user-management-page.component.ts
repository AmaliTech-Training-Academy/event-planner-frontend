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
import { mapUserStatus, User } from '../../../../core/models';
import { CommonModule } from '@angular/common';

type TabType = 'user-list' | 'admin';

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [
    CommonModule,
    AdminUserCardComponent,
    DataTableComponent,
    InviteUserModalComponent,
    SuccessModalComponent,
    EditUserProfileComponent,
    ViewUserProfileComponent,
  ],
  template: `
    <div class="user-management-page">
      <div class="user-management-page__cards">
        @for (card of userCards(); track card.title) {
        <app-admin-user-card [data]="card" />
        }
      </div>

      <div class="user-management-page__tabs">
        <button
          class="user-management-page__tab"
          [class.user-management-page__tab--active]="
            activeTab() === 'user-list'
          "
          (click)="switchTab('user-list')"
        >
          User List
        </button>
        <button
          class="user-management-page__tab"
          [class.user-management-page__tab--active]="activeTab() === 'admin'"
          (click)="switchTab('admin')"
        >
          Admin
        </button>
      </div>

      @if (activeTab() === 'user-list') {
      <div class="user-management-page__table">
        <app-data-table
          tableTitle="User List"
          searchPlaceholder="Search users by name or email..."
          [data]="users()"
          [columns]="tableColumns"
          [actions]="tableActions"
          [filters]="tableFilters"
          [loading]="loading()"
          [primaryAction]="primaryAction"
          [searchable]="true"
          [showAvatar]="true"
          [showCheckboxes]="true"
          [showActionLabels]="false"
          [itemsPerPage]="10"
          [serverSidePagination]="true"
          [totalItems]="totalElements()"
          (pageChange)="onPageChange($event)"
          (searchChange)="onSearchChange($event)"
          (filterChange)="onFilterChange($event)"
          (rowExpanded)="onRowExpanded($event)"
        />
      </div>
      } @if (activeTab() === 'admin') {
      <div class="user-management-page__table">
        <app-data-table
          tableTitle="Admin"
          searchPlaceholder="Search admins by name or email..."
          [data]="mockAdmins()"
          [columns]="tableColumns"
          [actions]="tableActions"
          [filters]="adminTableFilters"
          [loading]="adminLoading()"
          [primaryAction]="primaryAction"
          [searchable]="true"
          [showAvatar]="true"
          [showCheckboxes]="true"
          [showActionLabels]="false"
          [itemsPerPage]="10"
          [serverSidePagination]="false"
          [totalItems]="mockAdmins().length"
          (pageChange)="onPageChange($event)"
          (searchChange)="onSearchChange($event)"
          (filterChange)="onFilterChange($event)"
          (rowExpanded)="onRowExpanded($event)"
        />
      </div>
      } @if (isInviteModalOpen()) {
      <app-invite-user-modal
        (close)="closeInviteModal()"
        (success)="onInviteSuccess()"
      />
      } @if (isSuccessModalOpen()) {
      <app-success-modal
        (close)="closeSuccessModal()"
        (action)="goToDashboard()"
      />
      } @if (isEditModalOpen() && selectedUser()) {
      <app-edit-user-profile
        [userData]="selectedUser()!"
        (close)="closeEditModal()"
        (save)="onSaveEdit($event)"
      />
      } @if (isViewModalOpen() && selectedUser()) {
      <app-view-user-profile
        [userData]="selectedUser()!"
        (close)="closeViewModal()"
        (toggleStatus)="onToggleUserStatus($event)"
        (edit)="onEditFromView()"
      />
      }
    </div>
  `,
  styleUrls: ['./user-management-page.component.scss'],
})
export class UserManagementPageComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);
  private readonly _userService = inject(UserManagementService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  protected readonly activeTab = signal<TabType>('user-list');
  protected readonly totalElements = toSignal(
    this._userService.totalElements$,
    {
      initialValue: 0,
    }
  );

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

  // Mock admin data
  protected readonly mockAdmins = signal<User[]>([
    {
      userId: 101,
      fullName: 'John Admin',
      email: 'john.admin@example.com',
      role: USER_ROLES.ADMIN,
      status: 'Active' as const,
      eventsOrganized: 15,
      eventsAttended: 8,
      profileImageUrl: 'https://i.pravatar.cc/150?img=12',
    },
    {
      userId: 102,
      fullName: 'Jane SuperAdmin',
      email: 'jane.super@example.com',
      role: USER_ROLES.ADMIN,
      status: 'Active' as const,
      eventsOrganized: 25,
      eventsAttended: 12,
      profileImageUrl: 'https://i.pravatar.cc/150?img=47',
    },
    {
      userId: 103,
      fullName: 'Bob Administrator',
      email: 'bob.admin@example.com',
      role: USER_ROLES.ADMIN,
      status: 'Inactive' as const,
      eventsOrganized: 5,
      eventsAttended: 3,
      profileImageUrl: 'https://i.pravatar.cc/150?img=33',
    },
  ]);

  protected readonly adminLoading = signal<boolean>(false);
  protected readonly adminCurrentPage = signal<number>(0);

  private readonly _currentSearch = signal<string>('');
  private readonly _currentFilters = signal<Map<string, string>>(new Map());

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
    { key: 'eventsOrganized', header: 'Events Organized', sortable: true },
    { key: 'eventsAttended', header: 'Events Attended', sortable: true },
  ];

  protected readonly tableActions: TableAction<User>[] = [
    {
      icon: 'icons/view-icon.png',
      label: 'View User Details',
      title: 'View user profile and details',
      color: 'view',
      handler: (user) => this._viewUser(user),
    },
    {
      icon: 'icons/edit-icon.png',
      label: 'Edit User',
      title: (user) => `Edit ${user.fullName || user.name || 'user'}`,
      color: 'edit',
      handler: (user) => this._editUser(user),
    },
    {
      icon: 'icons/power-red.png',
      label: 'Toggle User Status',
      title: (user) =>
        user.status === 'Active'
          ? `Deactivate ${user.fullName || user.name || 'user'}`
          : `Activate ${user.fullName || user.name || 'user'}`,
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
        { label: 'Organizer', value: USER_ROLES.ORGANIZER },
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

  // Admin-specific filters (without role filter)
  protected readonly adminTableFilters: TableFilter[] = [
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

  protected switchTab(tab: TabType): void {
    this.activeTab.set(tab);
    if (tab === 'user-list') {
      this._loadUsers();
    }
    // For admin tab, we're using mock data, so no API call needed
  }

  private _loadUsers(page: number = 0): void {
    const search = this._currentSearch();
    const filters = this._currentFilters();

    const keyword = search.trim() || undefined;
    const role = filters.get('role');
    const roleValue = role && role !== 'all' ? role : undefined;
    const status = filters.get('status');
    const statusValue =
      status && status !== 'all' ? this._normalizeStatus(status) : undefined;

    if (keyword || roleValue || statusValue !== undefined) {
      this._userService
        .searchUsers(keyword, roleValue, statusValue, page)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe();
    } else {
      this._userService
        .fetchAllUsers(page)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe();
    }
  }

  private _normalizeStatus(value: string): boolean {
    return value.toLowerCase() === 'active' || value === 'true';
  }

  public onPageChange(page: number): void {
    if (this.activeTab() === 'user-list') {
      this._loadUsers(page - 1);
    } else {
      this.adminCurrentPage.set(page - 1);
    }
  }

  public onSearchChange(query: string): void {
    this._currentSearch.set(query);
    if (this.activeTab() === 'user-list') {
      this._loadUsers(0);
    }
    // For admin, you could filter the mock data here if needed
  }

  public onFilterChange(event: { key: string; value: string }): void {
    const filters = new Map(this._currentFilters());
    filters.set(event.key, event.value);
    this._currentFilters.set(filters);
    if (this.activeTab() === 'user-list') {
      this._loadUsers(0);
    }
    // For admin, you could filter the mock data here if needed
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
    setTimeout(() => this.isSuccessModalOpen.set(true), 200);
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
    Promise.resolve().then(() => this.isEditModalOpen.set(true));
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
    if (!selectedUser?.userId) return;

    const userUpdateRequest = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || formData.phoneNumber || '',
      address: formData.address || '',
      status: selectedUser.status === 'Active',
    };

    const fd = new FormData();
    fd.append('userUpdateRequest', JSON.stringify(userUpdateRequest));

    if (formData.profileImage instanceof File) {
      fd.append('profilePicture', formData.profileImage);
    } else if (typeof formData.profileImage === 'string') {
      fd.append('profilePicture', formData.profileImage);
    }

    this._userService
      .updateUserWithFormData(selectedUser.userId.toString(), fd)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.closeEditModal();
          this._loadUsers(this.currentPage() || 0);
        },
        error: (error) => {
          alert('Failed to update user. Please try again.');
        },
      });
  }

  protected onRowExpanded(user: User): void {}

  private _openInviteModal(): void {
    this.openInviteModal();
  }

  private _viewUser(user: User): void {
    this._userService
      .getUser(user.userId.toString())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.selectedUser.set(response.data);
          this.isViewModalOpen.set(true);
        },
        error: (err) => {
          this.selectedUser.set(user);
          this.isViewModalOpen.set(true);
        },
      });
  }

  private _editUser(user: User): void {
    if (this.isViewModalOpen()) this.closeViewModal();

    this._userService
      .getUser(user.userId.toString())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.selectedUser.set(response.data);
          this.isEditModalOpen.set(true);
        },
        error: (err) => {
          this.selectedUser.set(user);
          this.isEditModalOpen.set(true);
        },
      });
  }

  private _toggleUserStatus(user: User): void {
    this.togglingUserId.set(user.userId);

    if (this.activeTab() === 'admin') {
      // Mock toggle for admin users
      setTimeout(() => {
        const admins = this.mockAdmins();
        const updatedAdmins = admins.map((admin) =>
          admin.userId === user.userId
            ? {
                ...admin,
                status: (admin.status === 'Active' ? 'Inactive' : 'Active') as
                  | 'Active'
                  | 'Inactive',
              }
            : admin
        );
        this.mockAdmins.set(updatedAdmins);
        this.togglingUserId.set(null);
      }, 500);
    } else {
      this._userService
        .toggleUserStatusWithBackend(user.userId)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this.togglingUserId.set(null);
          },
          error: (err) => {
            this.togglingUserId.set(null);
          },
        });
    }
  }
}
