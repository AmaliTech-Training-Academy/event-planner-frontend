import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPriceModalComponent } from './set-price-modal.component';

describe('SetPriceModalComponent', () => {
  let component: SetPriceModalComponent;
  let fixture: ComponentFixture<SetPriceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetPriceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetPriceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
