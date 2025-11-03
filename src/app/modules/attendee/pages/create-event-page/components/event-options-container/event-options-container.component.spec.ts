import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOptionsContainerComponent } from './event-options-container.component';

describe('EventOptionsContainerComponent', () => {
  let component: EventOptionsContainerComponent;
  let fixture: ComponentFixture<EventOptionsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventOptionsContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventOptionsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
