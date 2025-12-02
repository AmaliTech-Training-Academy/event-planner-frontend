import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  computed,
  model,
  ChangeDetectionStrategy,
  output,
  effect,
} from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  public readonly totalItems = input<number>(0);
  public readonly itemsPerPage = input<number>(10);
  public readonly maxVisiblePages = input<number>(5);
  public readonly pageChange = output<number>();
  public readonly zeroBased = input<boolean>(false);

  public readonly currentPage = model<number>(0);

  // Ensure currentPage is properly initialized based on zeroBased
  constructor() {
    effect(() => {
      const zb = this.zeroBased();
      const cp = this.currentPage();

      // If not zero-based and currentPage is 0, set it to 1
      if (!zb && cp === 0) {
        this.currentPage.set(1);
      }
    });
  }

  // The actual page number for calculations (always 1-based internally)
  private readonly effectivePage = computed(() => {
    const current = this.currentPage();
    const zb = this.zeroBased();

    // If zero-based input, add 1 for internal calculations
    // If one-based input, use as-is
    return zb ? current + 1 : current;
  });

  public readonly totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.itemsPerPage()),
  );

  public readonly startIndex = computed(() => {
    const page = this.effectivePage();
    const itemsPerPage = this.itemsPerPage();
    return (page - 1) * itemsPerPage + 1;
  });

  public readonly endIndex = computed(() => {
    const page = this.effectivePage();
    const itemsPerPage = this.itemsPerPage();
    const total = this.totalItems();
    return Math.min(page * itemsPerPage, total);
  });

  public readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.effectivePage();
    const max = this.maxVisiblePages();

    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

    const halfWindow = Math.floor(max / 2);
    let startPage = Math.max(1, current - halfWindow);
    let endPage = Math.min(total, current + halfWindow);

    if (current <= halfWindow) endPage = max;
    else if (current >= total - halfWindow) startPage = total - max + 1;

    const pages: (number | string)[] = [];

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);

    if (endPage < total) {
      if (endPage < total - 1) pages.push('...');
      pages.push(total);
    }

    return pages;
  });

  public goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages()) {
      // Convert display page to model value
      const modelValue = this.zeroBased() ? page - 1 : page;
      this.currentPage.set(modelValue);
      this.pageChange.emit(modelValue);
    }
  }

  public isActivePage(page: number | string): boolean {
    return page === this.effectivePage();
  }

  public canGoPrevious(): boolean {
    return this.effectivePage() > 1;
  }

  public canGoNext(): boolean {
    return this.effectivePage() < this.totalPages();
  }

  public goToPrevious(): void {
    this.goToPage(this.effectivePage() - 1);
  }

  public goToNext(): void {
    this.goToPage(this.effectivePage() + 1);
  }

  public readonly serverSidePagination = input<boolean>(false);
}
