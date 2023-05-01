import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { UpdatesingleformComponent } from './updatesingleform.component';

describe('UpdatesingleformComponent', () => {
  let component: UpdatesingleformComponent;
  let fixture: ComponentFixture<UpdatesingleformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatesingleformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatesingleformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
