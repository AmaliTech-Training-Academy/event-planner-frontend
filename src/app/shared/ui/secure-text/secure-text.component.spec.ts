import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureTextComponent } from './secure-text.component';

describe('SecureTextComponent', () => {
  let component: SecureTextComponent;
  let fixture: ComponentFixture<SecureTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecureTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecureTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
