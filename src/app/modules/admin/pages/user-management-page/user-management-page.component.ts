// user-management-page.component.ts
import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { AdminUserCardComponent } from '../../../../shared/admin-ui/admin-user-card/admin-user-card.component';
import {
  DataTableComponent,
  TableAction,
  TableColumn,
  TableFilter,
} from '../../../../shared/admin-ui/data-table/data-table.component';
import { User, UserCardData } from '../../../../core/models/user.model';
import { USER_ROLES } from '../../../../core/constants/user.constants';
import { UserManagementService } from '../../../../core/services/user-management.service';

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [AdminUserCardComponent, DataTableComponent, AsyncPipe],
  templateUrl: './user-management-page.component.html',
  styleUrls: ['./user-management-page.component.scss'],
})
export class UserManagementPageComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);
  private readonly _userService = inject(UserManagementService);
  private readonly _destroyRef = inject(DestroyRef);

  // Reactive data as signals (converted from observables)
  public readonly userCards = toSignal(this._userService.userCards$, {
    initialValue: [],
  });
  public readonly users = toSignal(this._userService.users$, {
    initialValue: [],
  });
  public readonly loading = toSignal(this._userService.loading$, {
    initialValue: false,
  });
  public readonly totalPages = toSignal(this._userService.totalPages$, {
    initialValue: 1,
  });
  public readonly currentPage = toSignal(this._userService.currentPage$, {
    initialValue: 0,
  });

  // Table columns
  public readonly tableColumns: TableColumn<User>[] = [
    {
      key: 'fullName',
      header: 'User',
      sortable: true,
      getValue: (user) => user.fullName || user.name || 'N/A',
    },
    { key: 'role', header: 'Role(s)', filterable: true },
    {
      key: 'status',
      header: 'Status',
      filterable: true,
      getValue: (user) => (user.status ? 'Active' : 'Inactive'),
    },
    { key: 'eventsOrganized', header: 'Events Organized', sortable: true },
    { key: 'eventsAttended', header: 'Events Attended', sortable: true },
  ];

  // Table actions
  public readonly tableActions: TableAction<User>[] = [
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
  public readonly tableFilters: TableFilter[] = [
    {
      key: 'role',
      placeholder: 'All Roles',
      options: [
        { label: 'Organiser', value: 'ORGANISER' },
        { label: 'Co-Organiser', value: 'CO_ORGANISER' },
        { label: 'Attendee', value: 'ATTENDEE' },
        { label: 'Venue Staff', value: 'VENUE_STAFF' },
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

  public readonly primaryAction = {
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
    this._loadUsers(page);
  }

  private _viewUser(user: User): void {
    console.log('Viewing user:', user);
    // Navigate to user details page
  }

  private _editUser(user: User): void {
    console.log('Editing user:', user);
    // Open edit dialog or navigate to edit page
  }

  private _toggleUserStatus(user: User): void {
    this._userService.toggleUserStatus(user.userId);
  }

  private _inviteUser(): void {
    // Open invite user dialog
  }

  public onRowExpanded(user: User): void {
    console.log('Row expanded:', user);
  }
}
