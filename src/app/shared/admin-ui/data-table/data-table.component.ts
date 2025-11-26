import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  input,
  output,
  inject,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../ui/button/button.component';
import { CheckboxComponent } from '../../ui/checkbox/checkbox.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FilterSelectComponent } from '../filter-select/filter-select.component';
import { InputComponent } from '../../ui/input/input.component';
import { UserManagementService } from '../../../core/services/user-management.service';
import { debounceTime, Subject, take } from 'rxjs';

export interface TableColumn<T> {
  readonly key: Extract<keyof T, string>;
  readonly header: string;
  readonly sortable?: boolean;
  readonly filterable?: boolean;
  cell?: (row: T) => any; // Add this line

  readonly getValue?: (item: T) => string | number | boolean | null;
}
export interface EmptyState {
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly message: string;
}

export interface TableAction<T> {
  readonly icon: string;
  readonly label: string;
  readonly title?: string | ((item: T) => string);
  readonly color?: string;
  readonly extraClass?: string;
  readonly handler: (item: T) => void;
  readonly visible?: (item: T) => boolean;
  readonly disabled?: boolean | ((item: T) => boolean);
  readonly type?: 'primary' | 'secondary' | 'social' | 'action';
  readonly isLoading?: (item: T) => boolean;
}

export interface FilterOption {
  readonly label: string;
  readonly value: string;
}

export interface TableFilter {
  readonly key: string;
  readonly placeholder: string;
  readonly options: ReadonlyArray<FilterOption>;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilterSelectComponent,
    ButtonComponent,
    CheckboxComponent,
    PaginationComponent,
    InputComponent,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends Record<string, any>> {
  public readonly tableTitle = input<string>('User List');
  public readonly searchPlaceholder = input<string>();
  public readonly searchBoxClass = input<string>();
  public readonly searchSize = input<'md' | 'lg'>('md');
  public readonly showFilters = input<boolean>(true);
  public readonly data = input.required<ReadonlyArray<T>>();
  public readonly columns = input.required<ReadonlyArray<TableColumn<T>>>();
  public readonly actions = input<ReadonlyArray<TableAction<T>>>([]);
  public readonly filters = input<ReadonlyArray<TableFilter>>([]);
  public readonly searchable = input<boolean>(true);
  public readonly searchKey = input<string>('');

  public readonly expandable = input<boolean>(false);
  public readonly showCheckboxes = input<boolean>(false);
  public readonly showActionLabels = input<boolean>(false);

  public readonly showExport = input<boolean>(false);
  public readonly showAvatar = input<boolean>(true);
  public readonly searchChange = output<string>();
  public readonly filterChange = output<{ key: string; value: string }>();
  public readonly loading = input<boolean>(false);
  public readonly primaryAction = input<{
    readonly label: string;
    readonly handler: () => void;
  }>();
  public readonly itemsPerPage = input<number>(10);
  public readonly serverSidePagination = input<boolean>(false);
  public readonly totalItems = input<number>(0);

  public readonly rowExpanded = output<T>();
  public readonly pageChange = output<number>();

  protected readonly userService = inject(UserManagementService, {
    optional: true,
  });

  private readonly _activeFilters = signal<Map<string, string>>(new Map());
  private readonly _localSearchQuery = signal<string>('');
  private readonly _expandedRows = signal<Set<number>>(new Set());
  private readonly _selectedItems = signal<Set<T>>(new Set());
  private readonly _searchQuery = signal<string>('');
  private readonly _currentPage = signal<number>(1);

  public readonly effectiveSearchPlaceholder = computed(() => {
    const customPlaceholder = this.searchPlaceholder();
    const title = this.tableTitle();

    if (customPlaceholder) {
      return customPlaceholder;
    }

    if (title.toLowerCase().includes('user')) {
      return 'Search users...';
    } else if (title.toLowerCase().includes('event')) {
      return 'Search events...';
    } else if (title.toLowerCase().includes('invitation')) {
      return 'Search invitations...';
    } else if (title.toLowerCase().includes('audit')) {
      return 'Search audit logs...';
    }

    if (title.toLowerCase().includes('role')) {
      return 'Search roles...';
    }
    if (title.toLowerCase().includes('saved')) {
      return 'Search saved invitations...';
    }

    return `Search ${title.toLowerCase()}...`;
  });
  public readonly currentPage = computed(() => this._currentPage());
  public readonly searchQuery = computed(() => this._searchQuery());

  public readonly filteredData = computed(() => {
    const localQuery = this._localSearchQuery().toLowerCase().trim();
    const items = this.data();
    const activeFilters = this._activeFilters();

    if (this.serverSidePagination()) {
      return items;
    }

    let filtered = items;

    if (localQuery) {
      filtered = filtered.filter((item) => {
        const searchableText = Object.values(item)
          .filter((value) => value != null && typeof value !== 'object')
          .map((value) => String(value))
          .join(' ')
          .toLowerCase();

        return searchableText.includes(localQuery);
      });
    }

    activeFilters.forEach((value, key) => {
      if (value && value !== 'all') {
        filtered = filtered.filter((item) => {
          const itemValue = String(item[key] || '').toLowerCase();
          return itemValue === value.toLowerCase();
        });
      }
    });

    return filtered;
  });

  private _searchSubject = new Subject<string>();
  constructor() {
    this._searchSubject.pipe(debounceTime(600)).subscribe((query) => {
      this._searchQuery.set(query);
      this._currentPage.set(1);

      if (this.serverSidePagination()) {
        this.searchChange.emit(query);
      } else {
        this._performBackendSearch(0);
      }
    });
  }

  public setCurrentPage(page: number): void {
    this._currentPage.set(page);

    if (this.serverSidePagination()) {
      this.pageChange.emit(page);
    } else {
      this._performBackendSearch(page - 1);
    }
  }

  public readonly paginatedData = computed(() => {
    const filtered = this.filteredData();

    if (this.serverSidePagination()) {
      return filtered;
    }

    const itemsPerPage = this.itemsPerPage();
    const currentPage = this._currentPage();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filtered.slice(startIndex, endIndex);
  });
  public isSelected(item: T): boolean {
    return this._selectedItems().has(item);
  }
  public readonly emptyState = input<EmptyState>({
    imageSrc: '/images/table-empty.png',
    imageAlt: 'No data found',
    message: 'No data available',
  });

  protected toggleSelect(item: T): void {
    const selected: Set<T> = new Set(this._selectedItems());
    selected.has(item) ? selected.delete(item) : selected.add(item);
    this._selectedItems.set(selected);
  }
  public capitalizeFirstLetter(value: string | undefined | null): string {
    if (!value) return '';
    value = value.toString().toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  public getUserAvatar(item: T): string {
    let profileImageUrl = item['profileImageUrl'] || item['avatar'];

    if (profileImageUrl) {
      const urlParts = profileImageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const encodedFileName = encodeURIComponent(fileName);
      urlParts[urlParts.length - 1] = encodedFileName;
      profileImageUrl = urlParts.join('/');

      return profileImageUrl;
    }

    return '';
  }

  public getUserInitials(item: T): string {
    if (item['initials']) {
      return item['initials'];
    }

    const name = item['fullName'] || item['name'] || '';
    if (name) {
      const names = name.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
      } else if (names.length === 1) {
        return names[0].substring(0, 2).toUpperCase();
      }
    }

    const email = item['email'] || '';
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }

    return '??';
  }

  public hasProfileImage(item: T): boolean {
    const profileImageUrl = item['profileImageUrl'] || item['avatar'];
    return !!profileImageUrl;
  }

  public getInitials(item: T): string {
    const name = item['fullName'] || item['name'] || item['email'] || 'U';

    // Split by space and take first letter of first two words
    const nameParts = name.trim().split(/\s+/);

    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length > 0) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }

    return 'U';
  }

  public isAllSelected(): boolean {
    const pageData = this.paginatedData();
    return (
      pageData.length > 0 &&
      pageData.every((item: T) => this._selectedItems().has(item))
    );
  }

  public getActionTitle(action: TableAction<T>, item: T): string {
    if ('title' in action && action.title) {
      return typeof action.title === 'function'
        ? action.title(item)
        : action.title;
    }

    if (action.color === 'power') {
      return item['status'] === 'Active' ? 'Deactivate' : 'Activate';
    }

    return action.label;
  }
  protected toggleSelectAll(): void {
    const pageData: ReadonlyArray<T> = this.paginatedData();
    const selected: Set<T> = new Set(this._selectedItems());

    if (this.isAllSelected()) {
      pageData.forEach((item: T) => selected.delete(item));
    } else {
      pageData.forEach((item: T) => selected.add(item));
    }
    this._selectedItems.set(selected);
  }

  protected executeAction(action: TableAction<T>, item: T): void {
    action.handler(item);
  }

  public executePrimaryAction(): void {
    const action = this.primaryAction();
    action?.handler();
  }

  public updateSearch(query: string): void {
    this._localSearchQuery.set(query);

    this._searchSubject.next(query);
  }
  public updateFilter(filterKey: string, value: string): void {
    if (filterKey === 'export' && value) {
      this._handleExport(value);
      return;
    }

    const filters = new Map(this._activeFilters());

    if (value === 'all' || value === '') {
      filters.delete(filterKey);
    } else {
      filters.set(filterKey, value);
    }

    this._activeFilters.set(filters);
    this._currentPage.set(1);

    if (this.serverSidePagination()) {
      const filterObj: Record<string, string> = {};
      filters.forEach((val, key) => {
        filterObj[key] = val;
      });

      this.filterChange.emit({ key: filterKey, value });
    } else {
      this._performBackendSearch(0);
    }
  }
  private _handleExport(format: string): void {
    const data = this.filteredData();
    const columns = this.columns();

    switch (format) {
      case 'csv':
        this._exportAsCSV(data, columns);
        break;
      case 'json':
        this._exportAsJSON(data, columns);
        break;
      case 'pdf':
        this._exportAsPDF(data, columns);
        break;
    }
  }
  private _exportAsCSV(
    data: readonly T[],
    columns: readonly TableColumn<T>[]
  ): void {
    const headers = columns.map((col) => col.header).join(',');
    const rows = data.map((item) =>
      columns
        .map((col) => {
          const value = col.getValue ? col.getValue(item) : item[col.key];
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csv = [headers, ...rows].join('\n');
    this._downloadFile(csv, 'text/csv', 'csv');
  }

  private _exportAsJSON(
    data: readonly T[],
    columns: readonly TableColumn<T>[]
  ): void {
    const exportData = data.map((item) => {
      const row: Record<string, any> = {};
      columns.forEach((col) => {
        row[col.header] = col.getValue ? col.getValue(item) : item[col.key];
      });
      return row;
    });

    const json = JSON.stringify(exportData, null, 2);
    this._downloadFile(json, 'application/json', 'json');
  }

  private _exportAsPDF(
    data: readonly T[],
    columns: readonly TableColumn<T>[]
  ): void {
    alert('PDF export requires additional library. Exporting as HTML instead.');

    let html =
      '<html><head><style>table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background-color:#4CAF50;color:white;}</style></head><body>';
    html += '<table><thead><tr>';

    columns.forEach((col) => {
      html += `<th>${col.header}</th>`;
    });
    html += '</tr></thead><tbody>';

    data.forEach((item) => {
      html += '<tr>';
      columns.forEach((col) => {
        const value = col.getValue ? col.getValue(item) : item[col.key];
        html += `<td>${value}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table></body></html>';

    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.tableTitle()}-${new Date().toISOString().split('T')[0]
      }.html`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private _downloadFile(
    content: string,
    mimeType: string,
    extension: string
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.tableTitle()}-${new Date().toISOString().split('T')[0]
      }.${extension}`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  private _totalFilteredItems = signal<number>(0);

  public readonly totalFilteredItems = computed(() => {
    if (this.serverSidePagination()) {
      return this.totalItems();
    }
    return this.filteredData().length;
  });

  private _performBackendSearch(page: number): void {
    const userService = this.userService;
    if (!userService) return;

    const keyword = this._searchQuery().trim() || undefined;
    const filters = this._activeFilters();
    const role =
      filters.get('role') !== 'all' ? filters.get('role') : undefined;
    const statusValue = filters.get('status');
    const status =
      statusValue && statusValue !== 'all'
        ? this._normalizeStatusToBoolean(statusValue)
        : undefined;

    userService
      .searchUsers(keyword, role, status, page)
      .pipe(take(1))
      .subscribe({
        next: (users) => {
          const total = userService.totalElements ?? users.length;
          this._totalFilteredItems.set(total);
        },
        error: (err) => {
          this._totalFilteredItems.set(0);
        },
      });
  }

  private _normalizeStatusToBoolean(status: string): boolean {
    const normalized = status.toLowerCase();
    return normalized === 'active' || normalized === 'true';
  }

  public toggleRow(index: number, item: T): void {
    const expanded = new Set(this._expandedRows());
    expanded.has(index) ? expanded.delete(index) : expanded.add(index);
    this._expandedRows.set(expanded);
    this.rowExpanded.emit(item);
  }

  protected isRowExpanded(index: number): boolean {
    return this._expandedRows().has(index);
  }

  protected isRoleOrStatus(key: keyof T | string | number | symbol): boolean {
    return ['role', 'status'].includes(String(key));
  }

  public getBadgeClass(value: string | boolean): string {
    let normalized = '';

    if (typeof value === 'boolean') {
      normalized = value ? 'active' : 'inactive';
    } else if (typeof value === 'string') {
      normalized = value.toLowerCase();
    }

    const roleMap: Record<string, string> = {
      organiser: 'organizer',
      organizer: 'organizer',
      attendee: 'attendee',
      active: 'active',
      inactive: 'inactive',
      successful: 'successful',
      failed: 'failed',
      // Event statuses
      pending: 'pending',
      draft: 'draft',
      completed: 'completed',
      canceled: 'cancelled',
      cancelled: 'cancelled',
    };

    const badgeClass = roleMap[normalized] || normalized;
    return `data-table__badge data-table__badge--${badgeClass}`;
  }
  public isUserActive(item: T): boolean {
    const status = item['status'];
    if (typeof status === 'boolean') return status;
    if (typeof status === 'string') return status.toLowerCase() === 'active';
    return false;
  }
  protected isActionVisible(action: TableAction<T>, item: T): boolean {
    return action.visible ? action.visible(item) : true;
  }

  public isActionDisabled(action: TableAction<T>, item: T): boolean {
    const disabled =
      typeof action.disabled === 'function'
        ? action.disabled(item)
        : !!action.disabled;
    const isLoading = action.isLoading ? action.isLoading(item) : false;
    return disabled || isLoading;
  }

  public isActionLoading(action: TableAction<T>, item: T): boolean {
    return action.isLoading ? action.isLoading(item) : false;
  }

  protected getFilterValue(filterKey: string): string {
    return this._activeFilters().get(filterKey) ?? 'all';
  }

  protected trackByIndex(index: number): number {
    return index;
  }
}
