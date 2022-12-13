import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EshpozModalComponent } from './eshpoz-modal.component';

describe('EshpozModalComponent', () => {
  let component: EshpozModalComponent;
  let fixture: ComponentFixture<EshpozModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EshpozModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EshpozModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
