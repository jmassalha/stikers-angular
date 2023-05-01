import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CortinasnotificationComponent } from './cortinasnotification.component';

describe('CortinasnotificationComponent', () => {
  let component: CortinasnotificationComponent;
  let fixture: ComponentFixture<CortinasnotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CortinasnotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CortinasnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
