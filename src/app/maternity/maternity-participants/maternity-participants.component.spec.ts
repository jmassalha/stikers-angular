import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaternityParticipantsComponent } from './maternity-participants.component';

describe('MaternityParticipantsComponent', () => {
  let component: MaternityParticipantsComponent;
  let fixture: ComponentFixture<MaternityParticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaternityParticipantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaternityParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
