import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventDateComponent } from './create-event-date.component';

describe('CreateEventDateComponent', () => {
  let component: CreateEventDateComponent;
  let fixture: ComponentFixture<CreateEventDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEventDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEventDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
