import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CortinasComponent } from './cortinas.component';

describe('CortinasComponent', () => {
  let component: CortinasComponent;
  let fixture: ComponentFixture<CortinasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CortinasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CortinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
