import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedBarChartReleaseComponent } from './grouped-bar-chart-release.component';

describe('GroupedBarChartReleaseComponent', () => {
  let component: GroupedBarChartReleaseComponent;
  let fixture: ComponentFixture<GroupedBarChartReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupedBarChartReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedBarChartReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
