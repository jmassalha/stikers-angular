import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TumorBoardComponent } from './tumor-board.component';

describe('TumorBoardComponent', () => {
  let component: TumorBoardComponent;
  let fixture: ComponentFixture<TumorBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TumorBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TumorBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
