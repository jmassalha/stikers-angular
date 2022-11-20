import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsDialogComponent } from './charts-dialog.component';

describe('ChartsDialogComponent', () => {
  let component: ChartsDialogComponent;
  let fixture: ComponentFixture<ChartsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
