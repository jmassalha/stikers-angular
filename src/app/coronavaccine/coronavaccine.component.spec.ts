import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CoronavaccineComponent } from './coronavaccine.component';

describe('CoronavaccineComponent', () => {
  let component: CoronavaccineComponent;
  let fixture: ComponentFixture<CoronavaccineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoronavaccineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoronavaccineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
