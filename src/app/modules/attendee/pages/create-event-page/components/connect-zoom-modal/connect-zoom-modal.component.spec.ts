import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectZoomModalComponent } from './connect-zoom-modal.component';

describe('ConnectZoomModalComponent', () => {
  let component: ConnectZoomModalComponent;
  let fixture: ComponentFixture<ConnectZoomModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectZoomModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectZoomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
