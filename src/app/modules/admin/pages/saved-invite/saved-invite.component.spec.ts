import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedInviteComponent } from './saved-invite.component';

describe('SavedInviteComponent', () => {
  let component: SavedInviteComponent;
  let fixture: ComponentFixture<SavedInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedInviteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
