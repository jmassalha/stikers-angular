import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusComplaintComponent } from './status-complaint.component';

describe('StatusComplaintComponent', () => {
  let component: StatusComplaintComponent;
  let fixture: ComponentFixture<StatusComplaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusComplaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
