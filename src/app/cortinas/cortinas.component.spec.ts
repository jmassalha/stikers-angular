import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CortinasComponent } from './cortinas.component';

describe('CortinasComponent', () => {
  let component: CortinasComponent;
  let fixture: ComponentFixture<CortinasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CortinasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CortinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
