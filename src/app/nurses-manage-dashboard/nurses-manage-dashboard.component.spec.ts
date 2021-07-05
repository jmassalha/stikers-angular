import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NursesManageDashboardComponent } from './nurses-manage-dashboard.component';

describe('NursesManageDashboardComponent', () => {
  let component: NursesManageDashboardComponent;
  let fixture: ComponentFixture<NursesManageDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NursesManageDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursesManageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
