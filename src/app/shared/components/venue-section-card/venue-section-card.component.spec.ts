import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueSectionCardComponent } from './venue-section-card.component';

describe('VenueSectionCardComponent', () => {
  let component: VenueSectionCardComponent;
  let fixture: ComponentFixture<VenueSectionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenueSectionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenueSectionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
