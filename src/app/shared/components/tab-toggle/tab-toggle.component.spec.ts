import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabToggleComponent } from './tab-toggle.component';

describe('TabToggleComponent', () => {
  let component: TabToggleComponent;
  let fixture: ComponentFixture<TabToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
