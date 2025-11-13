import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSettingsPageComponent } from './payment-settings-page.component';

describe('PaymentSettingsPageComponent', () => {
  let component: PaymentSettingsPageComponent;
  let fixture: ComponentFixture<PaymentSettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSettingsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
