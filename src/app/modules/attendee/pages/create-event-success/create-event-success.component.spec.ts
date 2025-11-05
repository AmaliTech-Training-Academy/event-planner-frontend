import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventSuccessComponent } from './create-event-success.component';

describe('CreateEventSuccessComponent', () => {
  let component: CreateEventSuccessComponent;
  let fixture: ComponentFixture<CreateEventSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEventSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEventSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
