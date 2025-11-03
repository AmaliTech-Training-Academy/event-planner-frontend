import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTimeZonePickerComponent } from './event-time-zone-picker.component';

describe('EventTimeZonePickerComponent', () => {
  let component: EventTimeZonePickerComponent;
  let fixture: ComponentFixture<EventTimeZonePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTimeZonePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTimeZonePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
