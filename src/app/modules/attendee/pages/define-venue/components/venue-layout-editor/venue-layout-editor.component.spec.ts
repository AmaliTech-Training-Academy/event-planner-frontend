import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueLayoutEditorComponent } from './venue-layout-editor.component';

describe('VenueLayoutEditorComponent', () => {
  let component: VenueLayoutEditorComponent;
  let fixture: ComponentFixture<VenueLayoutEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenueLayoutEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenueLayoutEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
