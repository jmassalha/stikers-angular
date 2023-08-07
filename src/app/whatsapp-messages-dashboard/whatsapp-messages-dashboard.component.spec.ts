import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappMessagesDashboardComponent } from './whatsapp-messages-dashboard.component';

describe('WhatsappMessagesDashboardComponent', () => {
  let component: WhatsappMessagesDashboardComponent;
  let fixture: ComponentFixture<WhatsappMessagesDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappMessagesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappMessagesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
