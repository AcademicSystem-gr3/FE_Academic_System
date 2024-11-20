import { TestBed } from '@angular/core/testing';

import { ServiceBaseService } from './service.base';

describe('ServiceBaseService', () => {
  let service: ServiceBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
