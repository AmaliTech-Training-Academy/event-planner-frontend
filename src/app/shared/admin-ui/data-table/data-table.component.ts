import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterSelectComponent } from '../filter-select/filter-select.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CheckboxComponent } from '../../ui/checkbox/checkbox.component';
import { InputComponent } from '../../ui/input/input.component';
import { PaginationComponent } from '../pagination/pagination.component';

export interface TableColumn<T> {
  key: Extract<keyof T, string>;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableAction<T> {
  icon: string;
  label: string;
  color?: string;
  handler: (item: T) => void;
  visible?: (item: T) => boolean;
  disabled?: boolean | ((item: T) => boolean);
  type?: 'primary' | 'secondary' | 'social' | 'action';
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface TableFilter {
  key: string;
  placeholder: string;
  options: FilterOption[];
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
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent<T extends Record<string, any>> {
  public readonly data = input.required<T[]>();
  public readonly columns = input.required<TableColumn<T>[]>();
  public readonly actions = input<TableAction<T>[]>([]);
  public readonly filters = input<TableFilter[]>([]);
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
  public readonly searchQuery = signal<string>('');
  public readonly currentPage = signal<number>(1);

  public readonly filteredDataSig = computed(() => {
    let result = this.data();
    const searchQuery = this.searchQuery().toLowerCase();

    if (searchQuery) {
      result = result.filter((item) => this._matchesSearch(item, searchQuery));
    }

    const activeFilters = this._activeFilters();
    activeFilters.forEach((value, key) => {
      if (value !== 'all') {
        result = result.filter(
          (item) => String(item[key]).toLowerCase() === value.toLowerCase()
        );
      }
    });

    return result;
  });

  public readonly paginatedDataSig = computed(() => {
    const filtered = this.filteredDataSig();
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filtered.slice(start, end);
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
    const currentPageData = this.paginatedDataSig();
    return (
      currentPageData.length > 0 &&
      currentPageData.every((item) => this._selectedItems().has(item))
    );
  }

  public toggleSelectAll(): void {
    const currentPageData = this.paginatedDataSig();
    const selected = new Set(this._selectedItems());

    if (this.isAllSelected()) {
      currentPageData.forEach((item) => selected.delete(item));
    } else {
      currentPageData.forEach((item) => selected.add(item));
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
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  public updateFilter(filterKey: string, value: string): void {
    const filters = new Map(this._activeFilters());
    filters.set(filterKey, value);
    this._activeFilters.set(filters);
    this.currentPage.set(1);
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

  private _matchesSearch(item: T, query: string): boolean {
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(query)
    );
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
