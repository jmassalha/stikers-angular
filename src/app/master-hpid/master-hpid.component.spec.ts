import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterHpidComponent } from './master-hpid.component';

describe('MasterHpidComponent', () => {
  let component: MasterHpidComponent;
  let fixture: ComponentFixture<MasterHpidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterHpidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterHpidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
