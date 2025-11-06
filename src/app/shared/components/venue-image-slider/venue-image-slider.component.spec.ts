import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueImageSliderComponent } from './venue-image-slider.component';

describe('VenueImageSliderComponent', () => {
  let component: VenueImageSliderComponent;
  let fixture: ComponentFixture<VenueImageSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenueImageSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenueImageSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
