import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ColonoscopyComponent } from './colonoscopy.component';

describe('ColonoscopyComponent', () => {
  let component: ColonoscopyComponent;
  let fixture: ComponentFixture<ColonoscopyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColonoscopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColonoscopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
