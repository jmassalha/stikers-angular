import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugProtocolsComponent } from './drug-protocols.component';

describe('DrugProtocolsComponent', () => {
  let component: DrugProtocolsComponent;
  let fixture: ComponentFixture<DrugProtocolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugProtocolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugProtocolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
