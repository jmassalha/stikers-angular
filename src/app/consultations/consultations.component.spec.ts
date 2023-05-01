import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ConsultationsComponent } from './consultations.component';

describe('ConsultationsComponent', () => {
  let component: ConsultationsComponent;
  let fixture: ComponentFixture<ConsultationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
