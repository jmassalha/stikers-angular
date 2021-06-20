import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugsnicComponent } from './drugsnic.component';

describe('DrugsnicComponent', () => {
  let component: DrugsnicComponent;
  let fixture: ComponentFixture<DrugsnicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugsnicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugsnicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
