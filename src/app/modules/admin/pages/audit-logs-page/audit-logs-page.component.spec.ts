import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogsPageComponent } from './audit-logs-page.component';

describe('AuditLogsPageComponent', () => {
  let component: AuditLogsPageComponent;
  let fixture: ComponentFixture<AuditLogsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditLogsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditLogsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
