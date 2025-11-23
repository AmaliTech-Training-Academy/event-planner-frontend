import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAcceptInviteComponent } from './user-accept-invite.component';

describe('UserAcceptInviteComponent', () => {
  let component: UserAcceptInviteComponent;
  let fixture: ComponentFixture<UserAcceptInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAcceptInviteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAcceptInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
