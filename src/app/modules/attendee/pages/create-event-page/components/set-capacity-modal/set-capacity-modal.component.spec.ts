import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCapacityModalComponent } from './set-capacity-modal.component';

describe('SetCapacityModalComponent', () => {
  let component: SetCapacityModalComponent;
  let fixture: ComponentFixture<SetCapacityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetCapacityModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetCapacityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
