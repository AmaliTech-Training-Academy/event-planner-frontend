import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTeamMemberComponent } from './edit-team-member.component';

describe('EditTeamMemberComponent', () => {
  let component: EditTeamMemberComponent;
  let fixture: ComponentFixture<EditTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTeamMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
