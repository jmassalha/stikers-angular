import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphsModalComponent } from './graphs-modal.component';

describe('GraphsModalComponent', () => {
  let component: GraphsModalComponent;
  let fixture: ComponentFixture<GraphsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
