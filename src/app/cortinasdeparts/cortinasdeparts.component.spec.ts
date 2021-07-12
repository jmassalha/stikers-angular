import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CortinasdepartsComponent } from './cortinasdeparts.component';

describe('CortinasdepartsComponent', () => {
  let component: CortinasdepartsComponent;
  let fixture: ComponentFixture<CortinasdepartsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CortinasdepartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CortinasdepartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
