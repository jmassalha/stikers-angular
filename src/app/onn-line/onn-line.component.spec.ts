import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnnLineComponent } from './onn-line.component';

describe('OnnLineComponent', () => {
  let component: OnnLineComponent;
  let fixture: ComponentFixture<OnnLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnnLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnnLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
