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
import { InputComponent } from '../../ui/input/input.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { FilterSelectComponent } from '../filter-select/filter-select.component';

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
  public readonly data = input.required<ReadonlyArray<T>>();
  public readonly columns = input.required<ReadonlyArray<TableColumn<T>>>();
  public readonly actions = input<ReadonlyArray<TableAction<T>>>([]);
  public readonly filters = input<ReadonlyArray<TableFilter>>([]);
  public readonly searchable = input<boolean>(true);
  public readonly expandable = input<boolean>(false);
  public readonly primaryAction = input<{
    label: string;
    handler: () => void;
  }>();
  public readonly itemsPerPage = input<number>(10);

  public readonly rowExpanded = output<T>();

  private readonly _activeFilters = signal<Map<string, string>>(new Map());
  private readonly _expandedRows = signal<Set<number>>(new Set());
  private readonly _selectedItems = signal<Set<T>>(new Set());
  private readonly _searchQuery = signal<string>('');
  private readonly _currentPage = signal<number>(1);
  public readonly currentPage = computed(() => this._currentPage());

  public readonly searchQuery = computed(() => this._searchQuery());

  public readonly filteredData = computed(() => {
    let result = this.data();
    const query = this._searchQuery().trim().toLowerCase();

    if (query) {
      result = result.filter((item) => this._matchesSearch(item, query));
    }

    const filters = this._activeFilters();
    filters.forEach((value, key) => {
      if (value !== 'all') {
        result = result.filter(
          (item) => String(item[key]).toLowerCase() === value.toLowerCase()
        );
      }
    });

    return result;
  });
  public setCurrentPage(page: number): void {
    this._currentPage.set(page);
  }
  public readonly paginatedData = computed(() => {
    const filtered = this.filteredData();
    const page = this._currentPage();
    const perPage = this.itemsPerPage();
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  });

  public isSelected(item: T): boolean {
    return this._selectedItems().has(item);
  }

  public toggleSelect(item: T): void {
    const selected = new Set(this._selectedItems());
    selected.has(item) ? selected.delete(item) : selected.add(item);
    this._selectedItems.set(selected);
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
    this._searchQuery.set(query);
    this._currentPage.set(1);
  }

  public updateFilter(filterKey: string, value: string): void {
    const filters = new Map(this._activeFilters());
    filters.set(filterKey, value);
    this._activeFilters.set(filters);
    this._currentPage.set(1);
  }

  public toggleRow(index: number): void {
    const expanded = new Set(this._expandedRows());
    expanded.has(index) ? expanded.delete(index) : expanded.add(index);
    this._expandedRows.set(expanded);
  }

  public isRowExpanded(index: number): boolean {
    return this._expandedRows().has(index);
  }

  public isRoleOrStatus(key: keyof T | string | number | symbol): boolean {
    return ['role', 'status'].includes(String(key));
  }

  public getBadgeClass(value: unknown): string {
    return `data-table__badge data-table__badge--${String(
      value
    ).toLowerCase()}`;
  }

  public isActionVisible(action: TableAction<T>, item: T): boolean {
    return action.visible ? action.visible(item) : true;
  }

  public isActionDisabled(action: TableAction<T>, item: T): boolean {
    return typeof action.disabled === 'function'
      ? action.disabled(item)
      : !!action.disabled;
  }

  public getFilterValue(filterKey: string): string {
    return this._activeFilters().get(filterKey) ?? 'all';
  }

  public trackByIndex(index: number): number {
    return index;
  }

  private _matchesSearch(item: T, query: string): boolean {
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(query)
    );
  }
}
