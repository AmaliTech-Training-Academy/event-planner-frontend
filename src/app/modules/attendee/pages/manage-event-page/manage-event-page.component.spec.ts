import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventPageComponent } from './manage-event-page.component';

describe('ManageEventComponent', () => {
  let component: ManageEventPageComponent;
  let fixture: ComponentFixture<ManageEventPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEventPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEventPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
