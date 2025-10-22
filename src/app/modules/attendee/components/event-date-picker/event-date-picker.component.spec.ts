import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDatePickerComponent } from './event-date-picker.component';

describe('EventDatePickerComponent', () => {
  let component: EventDatePickerComponent;
  let fixture: ComponentFixture<EventDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDatePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
