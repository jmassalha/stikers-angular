import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NursesDashboardComponent } from './nurses-dashboard.component';

describe('NursesDashboardComponent', () => {
  let component: NursesDashboardComponent;
  let fixture: ComponentFixture<NursesDashboardComponent>;

  beforeEach(async(() => {
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
