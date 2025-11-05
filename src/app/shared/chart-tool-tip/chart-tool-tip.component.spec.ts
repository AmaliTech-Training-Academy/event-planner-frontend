import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartToolTipComponent } from './chart-tool-tip.component';

describe('ChartToolTipComponent', () => {
  let component: ChartToolTipComponent;
  let fixture: ComponentFixture<ChartToolTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartToolTipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartToolTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
