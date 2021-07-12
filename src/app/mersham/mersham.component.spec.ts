import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MershamComponent } from './mersham.component';

describe('MershamComponent', () => {
  let component: MershamComponent;
  let fixture: ComponentFixture<MershamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MershamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MershamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
