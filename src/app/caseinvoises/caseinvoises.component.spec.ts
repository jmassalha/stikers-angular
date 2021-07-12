import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CaseinvoisesComponent } from './caseinvoises.component';

describe('CaseinvoisesComponent', () => {
  let component: CaseinvoisesComponent;
  let fixture: ComponentFixture<CaseinvoisesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseinvoisesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseinvoisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
