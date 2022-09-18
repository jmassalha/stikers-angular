import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StikersComponent } from './stikers.component';

describe('StikersComponent', () => {
  let component: StikersComponent;
  let fixture: ComponentFixture<StikersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StikersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StikersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
