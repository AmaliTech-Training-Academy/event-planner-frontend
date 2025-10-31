import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTimePickerComponent } from './event-time-picker.component';

describe('EventTimePickerComponent', () => {
  let component: EventTimePickerComponent;
  let fixture: ComponentFixture<EventTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTimePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
