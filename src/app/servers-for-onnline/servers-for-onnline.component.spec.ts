import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServersForOnnlineComponent } from './servers-for-onnline.component';

describe('ServersForOnnlineComponent', () => {
  let component: ServersForOnnlineComponent;
  let fixture: ComponentFixture<ServersForOnnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServersForOnnlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServersForOnnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
