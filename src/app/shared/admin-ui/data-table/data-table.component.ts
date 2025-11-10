import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../ui/button/button.component';
import { CheckboxComponent } from '../../ui/checkbox/checkbox.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FilterSelectComponent } from '../filter-select/filter-select.component';
import { InputComponent } from '../../ui/input/input.component';

export interface TableColumn<T> {
  readonly key: Extract<keyof T, string>;
  readonly header: string;
  readonly sortable?: boolean;
  readonly filterable?: boolean;
}

export interface TableAction<T> {
  readonly icon: string;
  readonly label: string;
  readonly color?: string;
  readonly handler: (item: T) => void;
  readonly visible?: (item: T) => boolean;
  readonly disabled?: boolean | ((item: T) => boolean);
  readonly type?: 'primary' | 'secondary' | 'social' | 'action';
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
  public readonly tableTitle = input<string>('User List');
  public readonly searchPlaceholder = input<string>();
  public readonly searchBoxClass = input<string>();
  public readonly searchSize = input<'md' | 'lg'>('md');
  public readonly showCheckboxes = input<boolean>(true);
  public readonly showFilters = input<boolean>(true);
  public readonly data = input.required<ReadonlyArray<T>>();
  public readonly columns = input.required<ReadonlyArray<TableColumn<T>>>();
  public readonly actions = input<ReadonlyArray<TableAction<T>>>([]);
  public readonly filters = input<ReadonlyArray<TableFilter>>([]);
  public readonly searchable = input<boolean>(true);
  public readonly expandable = input<boolean>(false);
  public readonly primaryAction = input<{
    readonly label: string;
    readonly handler: () => void;
  }>();
  public readonly itemsPerPage = input<number>(10);

  public readonly rowExpanded = output<T>();

  private readonly _activeFilters = signal<Map<string, string>>(new Map());
  private readonly _expandedRows = signal<Set<number>>(new Set());
  private readonly _selectedItems = signal<Set<T>>(new Set());
  private readonly _searchQuery = signal<string>('');
  private readonly _currentPage = signal<number>(1);

  public readonly currentPage = computed<number>(() => this._currentPage());
  public readonly searchQuery = computed<string>(() => this._searchQuery());

  public readonly filteredData = computed<ReadonlyArray<T>>(() => {
    let result: ReadonlyArray<T> = this.data();
    const query: string = this._searchQuery().trim().toLowerCase();

    if (query) {
      result = result.filter((item: T) => this._matchesSearch(item, query));
    }

    const filters: Map<string, string> = this._activeFilters();
    filters.forEach((value: string, key: string) => {
      if (value !== 'all') {
        result = result.filter(
          (item: T) => String(item[key]).toLowerCase() === value.toLowerCase()
        );
      }
    });

    return result;
  });

  public readonly paginatedData = computed<ReadonlyArray<T>>(() => {
    const filtered: ReadonlyArray<T> = this.filteredData();
    const page: number = this._currentPage();
    const perPage: number = this.itemsPerPage();
    const start: number = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  });

  public setCurrentPage(page: number): void {
    this._currentPage.set(page);
  }

  public updateSearch(query: string): void {
    this._searchQuery.set(query);
    this._currentPage.set(1);
  }

  public updateFilter(filterKey: string, value: string): void {
    const filters: Map<string, string> = new Map(this._activeFilters());
    filters.set(filterKey, value);
    this._activeFilters.set(filters);
    this._currentPage.set(1);
  }

  public executePrimaryAction(): void {
    const action = this.primaryAction();
    action?.handler();
  }

  protected isSelected(item: T): boolean {
    return this._selectedItems().has(item);
  }

  protected toggleSelect(item: T): void {
    const selected: Set<T> = new Set(this._selectedItems());
    selected.has(item) ? selected.delete(item) : selected.add(item);
    this._selectedItems.set(selected);
  }

  protected isAllSelected(): boolean {
    const pageData: ReadonlyArray<T> = this.paginatedData();
    return (
      pageData.length > 0 &&
      pageData.every((item: T) => this._selectedItems().has(item))
    );
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

  protected toggleRow(index: number): void {
    const expanded: Set<number> = new Set(this._expandedRows());
    expanded.has(index) ? expanded.delete(index) : expanded.add(index);
    this._expandedRows.set(expanded);
  }

  protected isRowExpanded(index: number): boolean {
    return this._expandedRows().has(index);
  }

  protected isRoleOrStatus(key: keyof T | string | number | symbol): boolean {
    return ['role', 'status'].includes(String(key));
  }

  protected getBadgeClass(value: unknown): string {
    return `data-table__badge data-table__badge--${String(
      value
    ).toLowerCase()}`;
  }

  protected isActionVisible(action: TableAction<T>, item: T): boolean {
    return action.visible ? action.visible(item) : true;
  }

  protected isActionDisabled(action: TableAction<T>, item: T): boolean {
    return typeof action.disabled === 'function'
      ? action.disabled(item)
      : !!action.disabled;
  }

  protected getFilterValue(filterKey: string): string {
    return this._activeFilters().get(filterKey) ?? 'all';
  }

  protected trackByIndex(index: number): number {
    return index;
  }

  protected getActionColor(
    action: TableAction<T>,
    item: T
  ): string | undefined {
    if (action.color === 'power') {
      return item['status'] === 'Active' ? 'power-active' : 'power-inactive';
    }
    return action.color;
  }

  protected getActionExtraClass(
    action: TableAction<T>,
    item: T
  ): string | undefined {
    if (action.color === 'power') {
      return item['status'] === 'Active' ? 'power-active' : 'power-inactive';
    }
    return action.color;
  }

  protected getActionIcon(action: TableAction<T>, item: T): string {
    if (action.color === 'power') {
      return item['status'] === 'Active'
        ? 'icons/power-icon-red.png'
        : 'icons/power-icon-green.png';
    }
    return action.icon;
  }

  protected getActionIconAlt(action: TableAction<T>, item: T): string {
    if (action.color === 'power') {
      return item['status'] === 'Active'
        ? 'Deactivate user icon'
        : 'Activate user icon';
    }
    return `${action.label} icon`;
  }

  protected getActionAriaLabel(action: TableAction<T>, item: T): string {
    if (action.color === 'power') {
      return item['status'] === 'Active' ? 'Deactivate user' : 'Activate user';
    }
    return action.label;
  }

  private _matchesSearch(item: T, query: string): boolean {
    return Object.values(item).some((value: unknown) =>
      String(value).toLowerCase().includes(query)
    );
  }
}
