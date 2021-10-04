import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherChildeLinkComponent } from './mother-childe-link.component';

describe('MotherChildeLinkComponent', () => {
  let component: MotherChildeLinkComponent;
  let fixture: ComponentFixture<MotherChildeLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotherChildeLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotherChildeLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
