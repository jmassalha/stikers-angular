import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CoronaformComponent } from './coronaform.component';

describe('CoronaformComponent', () => {
  let component: CoronaformComponent;
  let fixture: ComponentFixture<CoronaformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CoronaformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoronaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
