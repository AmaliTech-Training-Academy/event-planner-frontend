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
    InputComponent,
    PaginationComponent,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent<T extends Record<string, any>> {
  // Inputs
  public data = input.required<T[]>();
  public columns = input.required<TableColumn<T>[]>();
  public actions = input<TableAction<T>[]>([]);
  public filters = input<TableFilter[]>([]);
  public searchable = input<boolean>(true);
  public expandable = input<boolean>(false);
  public primaryAction = input<{ label: string; handler: () => void }>();
  public itemsPerPage = input<number>(10);

  // Outputs
  public rowExpanded = output<T>();

  // Signals for state management
  public searchQuery = signal<string>('');
  public currentPage = signal<number>(1);
  private _activeFilters = signal<Map<string, string>>(new Map());
  private _expandedRows = signal<Set<number>>(new Set());
  private _selectedItems = signal<Set<T>>(new Set());

  // Selection logic
  public isSelected(item: T): boolean {
    return this._selectedItems().has(item);
  }

  public toggleSelect(item: T): void {
    const selected = new Set(this._selectedItems());
    if (selected.has(item)) {
      selected.delete(item);
    } else {
      selected.add(item);
    }
    this._selectedItems.set(selected);
  }

  public isActionDisabled(action: TableAction<T>, item: T): boolean {
    return typeof action.disabled === 'function'
      ? action.disabled(item)
      : !!action.disabled;
  }

  public isRoleOrStatus(key: keyof T | string | number | symbol): boolean {
    return ['role', 'status'].includes(String(key));
  }

  public getBadgeClass(value: unknown): string {
    return (
      'data-table__badge data-table__badge--' + String(value).toLowerCase()
    );
  }

  public isAllSelected(): boolean {
    const currentPageData = this.paginatedData();
    return (
      currentPageData.length > 0 &&
      currentPageData.every((item) => this._selectedItems().has(item))
    );
  }

  public toggleSelectAll(): void {
    const currentPageData = this.paginatedData();
    const selected = new Set(this._selectedItems());

    if (this.isAllSelected()) {
      // Deselect all items on current page
      currentPageData.forEach((item) => selected.delete(item));
    } else {
      // Select all items on current page
      currentPageData.forEach((item) => selected.add(item));
    }

    this._selectedItems.set(selected);
  }

  // Computed values
  public filteredData = computed(() => {
    let result = this.data();

    // Apply search filter
    const searchQuery = this.searchQuery().toLowerCase();
    if (searchQuery) {
      result = result.filter((item) => this._matchesSearch(item, searchQuery));
    }

    // Apply active filters
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

  public paginatedData = computed(() => {
    const filtered = this.filteredData();
    const page = this.currentPage(); // Changed from _currentPage
    const perPage = this.itemsPerPage();

    const start = (page - 1) * perPage;
    const end = start + perPage;

    return filtered.slice(start, end);
  });

  // Public methods for template
  public updateSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Changed from _currentPage
  }
  public updateFilter(filterKey: string, value: string): void {
    const filters = new Map(this._activeFilters());
    filters.set(filterKey, value);
    this._activeFilters.set(filters);
    this.currentPage.set(1); // Changed from _currentPage
  }

  public toggleRow(index: number): void {
    const expanded = new Set(this._expandedRows());
    if (expanded.has(index)) {
      expanded.delete(index);
    } else {
      expanded.add(index);
    }
    this._expandedRows.set(expanded);
  }

  public isRowExpanded(index: number): boolean {
    return this._expandedRows().has(index);
  }

  public isActionVisible(action: TableAction<T>, item: T): boolean {
    return action.visible ? action.visible(item) : true;
  }

  public executeAction(action: TableAction<T>, item: T): void {
    action.handler(item);
  }

  public executePrimaryAction(): void {
    const action = this.primaryAction();
    if (action) {
      action.handler();
    }
  }

  public getFilterValue(filterKey: string): string {
    return this._activeFilters().get(filterKey) || 'all';
  }



  // Private helper methods
  private _matchesSearch(item: T, query: string): boolean {
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(query)
    );
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
