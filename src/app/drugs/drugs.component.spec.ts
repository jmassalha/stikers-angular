import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DrugsComponent } from './drugs.component';

describe('DrugsComponent', () => {
  let component: DrugsComponent;
  let fixture: ComponentFixture<DrugsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
