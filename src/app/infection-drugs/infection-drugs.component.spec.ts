import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfectionDrugsComponent } from './infection-drugs.component';

describe('InfectionDrugsComponent', () => {
  let component: InfectionDrugsComponent;
  let fixture: ComponentFixture<InfectionDrugsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfectionDrugsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfectionDrugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
