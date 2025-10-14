import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtendeeLayoutComponent } from './atendee-layout.component';

describe('AtendeeLayoutComponent', () => {
  let component: AtendeeLayoutComponent;
  let fixture: ComponentFixture<AtendeeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtendeeLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtendeeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
