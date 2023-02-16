import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSingleSurgeryComponent } from './manage-single-surgery.component';

describe('ManageSingleSurgeryComponent', () => {
  let component: ManageSingleSurgeryComponent;
  let fixture: ComponentFixture<ManageSingleSurgeryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSingleSurgeryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSingleSurgeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
