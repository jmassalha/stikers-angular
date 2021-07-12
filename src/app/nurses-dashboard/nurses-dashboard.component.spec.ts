import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NursesDashboardComponent } from './nurses-dashboard.component';

describe('NursesDashboardComponent', () => {
  let component: NursesDashboardComponent;
  let fixture: ComponentFixture<NursesDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NursesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
