import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TumorBoardModalComponent } from './tumor-board-modal.component';

describe('TumorBoardModalComponent', () => {
  let component: TumorBoardModalComponent;
  let fixture: ComponentFixture<TumorBoardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TumorBoardModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TumorBoardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
