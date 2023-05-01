import { TestBed } from '@angular/core/testing';

import { HospitalBiService } from './hospital-bi.service';

describe('HospitalBiService', () => {
  let service: HospitalBiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitalBiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
