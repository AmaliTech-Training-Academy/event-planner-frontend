import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadEventFlyerComponent } from './upload-event-flyer.component';

describe('UploadEventFlyerComponent', () => {
  let component: UploadEventFlyerComponent;
  let fixture: ComponentFixture<UploadEventFlyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadEventFlyerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadEventFlyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
