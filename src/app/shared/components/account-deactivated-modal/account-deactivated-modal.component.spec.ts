import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDeactivatedModalComponent } from './account-deactivated-modal.component';

describe('AccountDeactivatedModalComponent', () => {
  let component: AccountDeactivatedModalComponent;
  let fixture: ComponentFixture<AccountDeactivatedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDeactivatedModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDeactivatedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
