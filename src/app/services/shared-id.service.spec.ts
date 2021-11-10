import { TestBed } from '@angular/core/testing';

import { SharedIDService } from './shared-id.service';

describe('SharedIDService', () => {
  let service: SharedIDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedIDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
