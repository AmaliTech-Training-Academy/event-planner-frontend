import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSavedInviteModalComponent } from './view-saved-invite-modal.component';

describe('ViewSavedInviteModalComponent', () => {
  let component: ViewSavedInviteModalComponent;
  let fixture: ComponentFixture<ViewSavedInviteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSavedInviteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSavedInviteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
