import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailPageComponent } from './verify-email-page.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('VerifyEmailPageComponent', () => {
  let component: VerifyEmailPageComponent;
  let fixture: ComponentFixture<VerifyEmailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyEmailPageComponent, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyEmailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
