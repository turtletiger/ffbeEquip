import { TestBed, inject } from '@angular/core/testing';

import { FilteringService } from './filtering.service';

describe('FilteringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilteringService]
    });
  });

  it('should be created', inject([FilteringService], (service: FilteringService) => {
    expect(service).toBeTruthy();
  }));
});
