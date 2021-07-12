import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasenumbersComponent } from './casenumbers.component';

describe('CasenumbersComponent', () => {
  let component: CasenumbersComponent;
  let fixture: ComponentFixture<CasenumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasenumbersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasenumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
