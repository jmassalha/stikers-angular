import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MershamComponent } from './mersham.component';

describe('MershamComponent', () => {
  let component: MershamComponent;
  let fixture: ComponentFixture<MershamComponent>;

  beforeEach(async(() => {
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
