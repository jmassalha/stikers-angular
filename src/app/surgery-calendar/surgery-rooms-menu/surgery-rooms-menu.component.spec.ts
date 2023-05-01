import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgeryRoomsMenuComponent } from './surgery-rooms-menu.component';

describe('SurgeryRoomsMenuComponent', () => {
  let component: SurgeryRoomsMenuComponent;
  let fixture: ComponentFixture<SurgeryRoomsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurgeryRoomsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurgeryRoomsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
