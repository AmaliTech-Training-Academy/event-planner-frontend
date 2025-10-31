import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

export interface VenueImage {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-venue-image-slider',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './venue-image-slider.component.html',
  styleUrl: './venue-image-slider.component.scss'
})
export class VenueImageSliderComponent implements OnInit, OnChanges {
  @Input() images: VenueImage[] = [];

 
  public currentIndex = 0;
  
  
  public slideWidthPercentage = 25; 
  
  public isPrevDisabled = true;
  public isNextDisabled = false;
  
  
  private slidesPerView = 4;
  
 
  
  public ngOnInit(): void {

    this.updateSliderState();
  }
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      this.currentIndex = 0; 
      this.updateSliderState();
    }
  }

  
  public next(): void {
    const maxIndex = this.images.length - this.slidesPerView;
    
  
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateButtonState();
    }
  }

  public prev(): void {
   
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateButtonState();
    }
  }

  
  private updateSliderState(): void {
   
    this.slidesPerView = 4; 
    
    
    this.slideWidthPercentage = 100 / this.slidesPerView;

    this.updateButtonState();
  }

  
  private updateButtonState(): void {
   
    this.isPrevDisabled = this.currentIndex === 0;
    
    
    const maxIndex = this.images.length - this.slidesPerView;

   
    this.isNextDisabled = this.currentIndex >= maxIndex;
  }
}

