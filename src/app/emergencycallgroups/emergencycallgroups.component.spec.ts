import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmergencycallgroupsComponent } from './emergencycallgroups.component';

describe('EmergencycallgroupsComponent', () => {
  let component: EmergencycallgroupsComponent;
  let fixture: ComponentFixture<EmergencycallgroupsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencycallgroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencycallgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
