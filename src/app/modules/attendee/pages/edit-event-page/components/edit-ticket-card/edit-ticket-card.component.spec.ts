import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTicketCardComponent } from './edit-ticket-card.component';

describe('EditTicketCardComponent', () => {
  let component: EditTicketCardComponent;
  let fixture: ComponentFixture<EditTicketCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTicketCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTicketCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
