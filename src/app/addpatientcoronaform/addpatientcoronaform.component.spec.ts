import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpatientcoronaformComponent } from './addpatientcoronaform.component';

describe('AddpatientcoronaformComponent', () => {
  let component: AddpatientcoronaformComponent;
  let fixture: ComponentFixture<AddpatientcoronaformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpatientcoronaformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpatientcoronaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
