import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { DimotComponent } from './dimot.component';

describe('DimotComponent', () => {
  let component: DimotComponent;
  let fixture: ComponentFixture<DimotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
