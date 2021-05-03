import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseinvoisesComponent } from './caseinvoises.component';

describe('CaseinvoisesComponent', () => {
  let component: CaseinvoisesComponent;
  let fixture: ComponentFixture<CaseinvoisesComponent>;

  beforeEach(async(() => {
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
