import { TestBed } from '@angular/core/testing';

import { HandleLikeService } from './handle-like.service';

describe('HandleLikeService', () => {
  let service: HandleLikeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleLikeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
