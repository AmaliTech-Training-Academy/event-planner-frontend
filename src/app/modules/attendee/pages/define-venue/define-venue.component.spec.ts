import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineVenueComponent } from './define-venue.component';

describe('DefineVenueComponent', () => {
  let component: DefineVenueComponent;
  let fixture: ComponentFixture<DefineVenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefineVenueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefineVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
