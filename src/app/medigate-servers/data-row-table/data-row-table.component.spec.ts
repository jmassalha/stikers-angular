import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRowTableComponent } from './data-row-table.component';

describe('DataRowTableComponent', () => {
  let component: DataRowTableComponent;
  let fixture: ComponentFixture<DataRowTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRowTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRowTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
