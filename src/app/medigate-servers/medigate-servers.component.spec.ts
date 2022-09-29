import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedigateServersComponent } from './medigate-servers.component';

describe('MedigateServersComponent', () => {
  let component: MedigateServersComponent;
  let fixture: ComponentFixture<MedigateServersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedigateServersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedigateServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
