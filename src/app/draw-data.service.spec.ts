import { TestBed } from '@angular/core/testing';

import { DrawDataService } from './draw-data.service';

describe('DrawDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawDataService = TestBed.get(DrawDataService);
    expect(service).toBeTruthy();
  });
});
