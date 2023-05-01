import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedBarChart2Component } from './grouped-bar-chart2.component';

describe('GroupedBarChart2Component', () => {
  let component: GroupedBarChart2Component;
  let fixture: ComponentFixture<GroupedBarChart2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupedBarChart2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedBarChart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
