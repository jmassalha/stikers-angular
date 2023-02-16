import { TestBed } from '@angular/core/testing';

import { SurgeriesServiceService } from './surgeries-service.service';

describe('SurgeriesServiceService', () => {
  let service: SurgeriesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurgeriesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
