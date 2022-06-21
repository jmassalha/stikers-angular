import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBornComponent } from './new-born.component';

describe('NewBornComponent', () => {
  let component: NewBornComponent;
  let fixture: ComponentFixture<NewBornComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBornComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBornComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
