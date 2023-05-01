import { TestBed } from '@angular/core/testing';

import { LogAllRequestsInterceptor } from './log-all-requests.interceptor';

describe('LogAllRequestsInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LogAllRequestsInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LogAllRequestsInterceptor = TestBed.inject(LogAllRequestsInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
