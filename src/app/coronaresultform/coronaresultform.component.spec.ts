import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoronaresultformComponent } from './coronaresultform.component';

describe('CoronaresultformComponent', () => {
  let component: CoronaresultformComponent;
  let fixture: ComponentFixture<CoronaresultformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoronaresultformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoronaresultformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
