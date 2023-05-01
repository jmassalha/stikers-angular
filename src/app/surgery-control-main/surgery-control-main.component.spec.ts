import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgeryControlMainComponent } from './surgery-control-main.component';

describe('SurgeryControlMainComponent', () => {
  let component: SurgeryControlMainComponent;
  let fixture: ComponentFixture<SurgeryControlMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurgeryControlMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurgeryControlMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
