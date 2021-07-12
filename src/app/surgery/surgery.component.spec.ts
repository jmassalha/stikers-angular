import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurgeryComponent } from './surgery.component';

describe('SurgeryComponent', () => {
  let component: SurgeryComponent;
  let fixture: ComponentFixture<SurgeryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurgeryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurgeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
