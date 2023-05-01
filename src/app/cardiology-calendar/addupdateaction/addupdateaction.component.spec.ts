import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddupdateactionComponent } from './addupdateaction.component';

describe('AddupdateactionComponent', () => {
  let component: AddupdateactionComponent;
  let fixture: ComponentFixture<AddupdateactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddupdateactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddupdateactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
