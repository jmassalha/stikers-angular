import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmergencymembersComponent } from './emergencymembers.component';

describe('EmergencymembersComponent', () => {
  let component: EmergencymembersComponent;
  let fixture: ComponentFixture<EmergencymembersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencymembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencymembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
