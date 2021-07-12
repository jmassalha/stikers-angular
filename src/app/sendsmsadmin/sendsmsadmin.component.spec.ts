import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { SendsmsadminComponent } from './sendsmsadmin.component';

describe('SendsmsadminComponent', () => {
  let component: SendsmsadminComponent;
  let fixture: ComponentFixture<SendsmsadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendsmsadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendsmsadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
