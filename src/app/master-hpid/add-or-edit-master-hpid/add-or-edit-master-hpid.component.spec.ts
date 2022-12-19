import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditMasterHpidComponent } from './add-or-edit-master-hpid.component';

describe('AddOrEditMasterHpidComponent', () => {
  let component: AddOrEditMasterHpidComponent;
  let fixture: ComponentFixture<AddOrEditMasterHpidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditMasterHpidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditMasterHpidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
