import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSavedInviteModalComponent } from './edit-saved-invite-modal.component';

describe('EditSavedInviteModalComponent', () => {
  let component: EditSavedInviteModalComponent;
  let fixture: ComponentFixture<EditSavedInviteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSavedInviteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSavedInviteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
