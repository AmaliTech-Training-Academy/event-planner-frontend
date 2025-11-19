import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPaymentSuccessComponent } from './event-payment-success.component';

describe('EventPaymentSuccessComponent', () => {
  let component: EventPaymentSuccessComponent;
  let fixture: ComponentFixture<EventPaymentSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventPaymentSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventPaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
