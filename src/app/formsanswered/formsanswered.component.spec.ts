import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormsansweredComponent } from './formsanswered.component';

describe('FormsansweredComponent', () => {
  let component: FormsansweredComponent;
  let fixture: ComponentFixture<FormsansweredComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsansweredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsansweredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
