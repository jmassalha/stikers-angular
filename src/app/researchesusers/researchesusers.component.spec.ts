import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResearchesusersComponent } from './researchesusers.component';

describe('ResearchesusersComponent', () => {
  let component: ResearchesusersComponent;
  let fixture: ComponentFixture<ResearchesusersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchesusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchesusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
