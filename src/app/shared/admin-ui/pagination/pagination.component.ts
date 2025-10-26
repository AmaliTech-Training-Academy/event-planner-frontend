import { CommonModule } from '@angular/common';
import { Component, input, output, computed, model, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent } from "../../ui/button/button.component";

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  public readonly totalItems = input.required<number>();
  public readonly itemsPerPage = input<number>(10);
  public readonly currentPage = model<number>(1);
  public readonly maxVisiblePages = input<number>(5);

  public readonly totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.itemsPerPage())
  );

  public readonly startIndex = computed(
    () => (this.currentPage() - 1) * this.itemsPerPage() + 1
  );

  public readonly endIndex = computed(() =>
    Math.min(this.currentPage() * this.itemsPerPage(), this.totalItems())
  );

  public readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const max = this.maxVisiblePages();

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const halfWindow = Math.floor(max / 2);
    let startPage = Math.max(1, current - halfWindow);
    let endPage = Math.min(total, current + halfWindow);

    if (current <= halfWindow) {
      endPage = max;
    } else if (current >= total - halfWindow) {
      startPage = total - max + 1;
    }

    const pages: (number | string)[] = [];

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < total) {
      if (endPage < total - 1) pages.push('...');
      pages.push(total);
    }

    return pages;
  });

  public goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
