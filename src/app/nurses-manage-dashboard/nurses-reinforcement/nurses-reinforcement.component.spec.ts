import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NursesReinforcementComponent } from './nurses-reinforcement.component';

describe('NursesReinforcementComponent', () => {
  let component: NursesReinforcementComponent;
  let fixture: ComponentFixture<NursesReinforcementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NursesReinforcementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursesReinforcementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
