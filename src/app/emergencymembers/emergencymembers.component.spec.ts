import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { EmergencymembersComponent } from './emergencymembers.component';

describe('EmergencymembersComponent', () => {
  let component: EmergencymembersComponent;
  let fixture: ComponentFixture<EmergencymembersComponent>;

  beforeEach(async(() => {
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
