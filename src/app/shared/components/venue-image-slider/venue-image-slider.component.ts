import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; // For @if, @for

// Define the interface for a single image
export interface VenueImage {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-venue-image-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './venue-image-slider.component.html',
  styleUrl: './venue-image-slider.component.scss'
})
export class VenueImageSliderComponent implements OnChanges {
  // --- Public API ---
  @Input() public images: VenueImage[] = [];

  // --- Public Properties ---
  public currentIndex: number = 0;
  public visibleImagesCount: number = 4; // How many images to show at once
  public slideWidthPercentage: number = 100 / this.visibleImagesCount;

  // --- State for Disabling Buttons ---
  public isPrevDisabled: boolean = true;
  public isNextDisabled: boolean = false;

  public ngOnChanges(changes: SimpleChanges): void {
    // Recalculate when images are loaded
    if (changes['images']) {
      this.updateButtonState();
    }
  }

  // --- Public Methods ---

  /**
   * Go to the previous slide
   */
  public prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateButtonState();
    }
  }

  /**
   * Go to the next slide
   */
  public next(): void {
    // We can show 'visibleImagesCount' images, so the last "page"
    // starts at total_images - visibleImagesCount
    const maxIndex = this.images.length - this.visibleImagesCount;
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateButtonState();
    }
  }

  /**
   * Update the disabled state of the nav buttons
   */
  private updateButtonState(): void {
    const maxIndex = this.images.length - this.visibleImagesCount;
    this.isPrevDisabled = this.currentIndex === 0;
    this.isNextDisabled = this.currentIndex >= maxIndex;
  }
}

