import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpPointsComponent } from './ip-points.component';

describe('IpPointsComponent', () => {
  let component: IpPointsComponent;
  let fixture: ComponentFixture<IpPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
