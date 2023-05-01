import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MershamNComponent } from './mersham-n.component';

describe('MershamNComponent', () => {
  let component: MershamNComponent;
  let fixture: ComponentFixture<MershamNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MershamNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MershamNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
