import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopOrganizersComponent } from './top-organizers.component';

describe('TopOrganizersComponent', () => {
  let component: TopOrganizersComponent;
  let fixture: ComponentFixture<TopOrganizersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopOrganizersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopOrganizersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
