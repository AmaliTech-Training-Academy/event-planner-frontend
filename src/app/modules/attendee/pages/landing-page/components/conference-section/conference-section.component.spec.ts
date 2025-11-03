import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceSectionComponent } from './conference-section.component';

describe('ConferenceSectionComponent', () => {
  let component: ConferenceSectionComponent;
  let fixture: ComponentFixture<ConferenceSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConferenceSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
