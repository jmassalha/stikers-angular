import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewNoteComponent } from './add-new-note.component';

describe('AddNewNoteComponent', () => {
  let component: AddNewNoteComponent;
  let fixture: ComponentFixture<AddNewNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
