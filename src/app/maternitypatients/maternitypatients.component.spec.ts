import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaternitypatientsComponent } from './maternitypatients.component';

describe('MaternitypatientsComponent', () => {
  let component: MaternitypatientsComponent;
  let fixture: ComponentFixture<MaternitypatientsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaternitypatientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaternitypatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
