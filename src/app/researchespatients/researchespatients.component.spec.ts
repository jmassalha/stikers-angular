import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResearchespatientsComponent } from './researchespatients.component';

describe('ResearchespatientsComponent', () => {
  let component: ResearchespatientsComponent;
  let fixture: ComponentFixture<ResearchespatientsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchespatientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchespatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
