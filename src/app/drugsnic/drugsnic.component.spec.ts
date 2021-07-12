import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DrugsnicComponent } from './drugsnic.component';

describe('DrugsnicComponent', () => {
  let component: DrugsnicComponent;
  let fixture: ComponentFixture<DrugsnicComponent>;

  beforeEach(waitForAsync(() => {
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
