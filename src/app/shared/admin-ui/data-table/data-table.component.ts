// data-table.component.ts
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  input,
  output,
  inject,
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
  readonly getValue?: (item: T) => string | number | boolean | null;
}

export interface TableAction<T> {
  readonly icon: string;
  readonly label: string;
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
    NgOptimizedImage,
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
  private readonly elementRef = inject(ElementRef);

  public readonly title = input<string>('Data Table');
  public readonly data = input.required<ReadonlyArray<T>>();
  public readonly columns = input.required<ReadonlyArray<TableColumn<T>>>();
  public readonly actions = input<ReadonlyArray<TableAction<T>>>([]);
  public readonly filters = input<ReadonlyArray<TableFilter>>([]);
  public readonly searchable = input<boolean>(true);
  public readonly searchPlaceholder = input<string>('Search...');
  public readonly expandable = input<boolean>(false);
  public readonly searchChange = output<string>();
  public readonly filterChange = output<{ key: string; value: string }>();
  public readonly loading = input<boolean>(false);
  public readonly primaryAction = input<{
    label: string;
    handler: () => void;
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

  public readonly currentPage = computed(() => this._currentPage());
  public readonly searchQuery = computed(() => this._searchQuery());

  public readonly filteredData = computed(() => {
    const localQuery = this._localSearchQuery().toLowerCase().trim();
    const items = this.data();

    if (!localQuery || !this.serverSidePagination()) {
      return items;
    }

    return items.filter((item) => {
      const searchableFields = [
        item['fullName'],
        item['name'],
        item['email'],
        item['role'],
      ]
        .filter(Boolean)
        .map((field) => String(field))
        .join(' ')
        .toLowerCase();

      return searchableFields.includes(localQuery);
    });
  });

  private _searchSubject = new Subject<string>();
  constructor() {
    this._searchSubject
      .pipe(
        debounceTime(600) // Wait 600ms after user stops typing
      )
      .subscribe((query) => {
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

  public readonly paginatedData = computed(() => this.filteredData());

  public isSelected(item: T): boolean {
    return this._selectedItems().has(item);
  }

  public toggleSelect(item: T): void {
    const selected = new Set(this._selectedItems());
    selected.has(item) ? selected.delete(item) : selected.add(item);
    this._selectedItems.set(selected);
  }
  public capitalizeFirstLetter(value: string | undefined | null): string {
    if (!value) return '';
    value = value.toString().toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  public getRandomAvatar(item: T): string {
    const identifier = item['userId'] || item['email'] || item['id'] || '';
    const avatarNumber = (String(identifier).charCodeAt(0) % 70) + 1;

    return `https://i.pravatar.cc/150?img=${avatarNumber}`;
  }
  public isAllSelected(): boolean {
    const pageData = this.paginatedData();
    return (
      pageData.length > 0 &&
      pageData.every((item) => this._selectedItems().has(item))
    );
  }

  public toggleSelectAll(): void {
    const pageData = this.paginatedData();
    const selected = new Set(this._selectedItems());

    if (this.isAllSelected()) {
      pageData.forEach((item) => selected.delete(item));
    } else {
      pageData.forEach((item) => selected.add(item));
    }
    this._selectedItems.set(selected);
  }

  public executeAction(action: TableAction<T>, item: T): void {
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
    const filters = new Map(this._activeFilters());
    filters.set(filterKey, value);
    this._activeFilters.set(filters);
    this._currentPage.set(1);

    if (this.serverSidePagination()) {
      this.filterChange.emit({ key: filterKey, value });
    } else {
      this._performBackendSearch(0);
    }
  }

  private _totalFilteredItems = signal<number>(0);
  public readonly totalFilteredItems = computed(() => {
    if (this.serverSidePagination()) {
      return this.totalItems();
    }
    return this._totalFilteredItems();
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

  public isRowExpanded(index: number): boolean {
    return this._expandedRows().has(index);
  }

  public isRoleOrStatus(key: keyof T | string | number | symbol): boolean {
    return ['role', 'status'].includes(String(key));
  }

  public getBadgeClass(value: string): string {
    const normalized = value.toLowerCase();

    const roleMap: Record<string, string> = {
      organiser: 'organizer',
      organizer: 'organizer',
      attendee: 'attendee',
      active: 'active',
      inactive: 'inactive',
    };

    const badgeClass = roleMap[normalized] || normalized;
    return `data-table__badge data-table__badge--${badgeClass}`;
  }

  public isActionVisible(action: TableAction<T>, item: T): boolean {
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

  public getFilterValue(filterKey: string): string {
    return this._activeFilters().get(filterKey) ?? 'all';
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
