import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeZonePickerComponent } from './time-zone-picker.component';

describe('TimeZonePickerComponent', () => {
  let component: TimeZonePickerComponent;
  let fixture: ComponentFixture<TimeZonePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeZonePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeZonePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
