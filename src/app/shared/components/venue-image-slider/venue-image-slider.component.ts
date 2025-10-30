import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; 


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
 
  @Input() public images: VenueImage[] = [];

  
  public currentIndex: number = 0;
  public visibleImagesCount: number = 4; 
  public slideWidthPercentage: number = 100 / this.visibleImagesCount;

  
  public isPrevDisabled: boolean = true;
  public isNextDisabled: boolean = false;

  public ngOnChanges(changes: SimpleChanges): void {
   
    if (changes['images']) {
      this.updateButtonState();
    }
  }

 
  public prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateButtonState();
    }
  }

 
  public next(): void {
   
    const maxIndex = this.images.length - this.visibleImagesCount;
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateButtonState();
    }
  }


   
  private updateButtonState(): void {
    const maxIndex = this.images.length - this.visibleImagesCount;
    this.isPrevDisabled = this.currentIndex === 0;
    this.isNextDisabled = this.currentIndex >= maxIndex;
  }
}

