import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CprFormComponent } from './cpr-form.component';

describe('CprFormComponent', () => {
  let component: CprFormComponent;
  let fixture: ComponentFixture<CprFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CprFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CprFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
