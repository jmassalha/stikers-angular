import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CoronaresultformComponent } from './coronaresultform.component';

describe('CoronaresultformComponent', () => {
  let component: CoronaresultformComponent;
  let fixture: ComponentFixture<CoronaresultformComponent>;

  beforeEach(waitForAsync(() => {
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
