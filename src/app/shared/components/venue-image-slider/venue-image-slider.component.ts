import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-venue-image-slider',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ButtonComponent],
  templateUrl: './venue-image-slider.component.html',
  styleUrl: './venue-image-slider.component.scss',
})
export class VenueImageSliderComponent implements OnChanges {
  
  @Input() images: string[] = [];
   @Output() imageClick = new EventEmitter<string>();
  
  onImageClick(image: string): void {
    this.imageClick.emit(image);
  }

  protected currentIndex = signal(0);
  protected slidesPerView = signal(4);

  protected totalSlides = computed(() => this.images.length);
  protected slideWidthPercentage = computed(() => 100 / this.slidesPerView());

  protected isPrevDisabled = computed(() => this.currentIndex() === 0);
  protected isNextDisabled = computed(() => {
    return this.currentIndex() >= this.totalSlides() - this.slidesPerView();
  });

  constructor() {
    this.updateSlidesPerView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      this.currentIndex.set(0);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSlidesPerView();
  }

  private updateSlidesPerView(): void {
    if (window.innerWidth < 480) {
      this.slidesPerView.set(1);
    } else if (window.innerWidth < 767) {
      this.slidesPerView.set(2);
    } else if (window.innerWidth < 1023) {
      this.slidesPerView.set(3);
    } else {
      this.slidesPerView.set(4);
    }
  }

  protected prev(): void {
    this.currentIndex.update((prev) => Math.max(prev - 1, 0));
  }

  protected next(): void {
    this.currentIndex.update((prev) =>
      Math.min(prev + 1, this.totalSlides() - this.slidesPerView())
    );
  }
}
