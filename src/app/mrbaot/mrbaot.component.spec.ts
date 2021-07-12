import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MrbaotComponent } from './mrbaot.component';

describe('MrbaotComponent', () => {
  let component: MrbaotComponent;
  let fixture: ComponentFixture<MrbaotComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MrbaotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrbaotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
