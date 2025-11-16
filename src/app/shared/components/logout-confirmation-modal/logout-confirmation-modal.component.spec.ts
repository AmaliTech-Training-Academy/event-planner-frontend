import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutConfirmationModalComponent } from './logout-confirmation-modal.component';

describe('LogoutConfirmationModalComponent', () => {
  let component: LogoutConfirmationModalComponent;
  let fixture: ComponentFixture<LogoutConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutConfirmationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoutConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
