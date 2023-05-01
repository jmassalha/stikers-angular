import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicInquiriesChartsComponent } from './public-inquiries-charts.component';

describe('PublicInquiriesChartsComponent', () => {
  let component: PublicInquiriesChartsComponent;
  let fixture: ComponentFixture<PublicInquiriesChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicInquiriesChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicInquiriesChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
