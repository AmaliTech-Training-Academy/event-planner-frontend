import { Component, input, output, computed, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  // Inputs
  public totalItems = input.required<number>();
  public itemsPerPage = input<number>(10);
  public currentPage = model<number>(1); // Changed to model for two-way binding
  public maxVisiblePages = input<number>(5);

  // Computed values
  public totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.itemsPerPage())
  );

  public startIndex = computed(
    () => (this.currentPage() - 1) * this.itemsPerPage() + 1
  );

  public endIndex = computed(() =>
    Math.min(this.currentPage() * this.itemsPerPage(), this.totalItems())
  );

  public visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const max = this.maxVisiblePages();

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfMax = Math.floor(max / 2);

    let startPage = Math.max(1, current - halfMax);
    let endPage = Math.min(total, current + halfMax);

    if (current <= halfMax) {
      endPage = max;
    } else if (current >= total - halfMax) {
      startPage = total - max + 1;
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < total) {
      if (endPage < total - 1) {
        pages.push('...');
      }
      pages.push(total);
    }

    return pages;
  });

  // Public methods
  public goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
