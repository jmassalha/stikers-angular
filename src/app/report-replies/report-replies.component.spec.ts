import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportRepliesComponent } from './report-replies.component';

describe('ReportRepliesComponent', () => {
  let component: ReportRepliesComponent;
  let fixture: ComponentFixture<ReportRepliesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportRepliesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
