import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalCprTablesComponent } from './additional-cpr-tables.component';

describe('AdditionalCprTablesComponent', () => {
  let component: AdditionalCprTablesComponent;
  let fixture: ComponentFixture<AdditionalCprTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalCprTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalCprTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
