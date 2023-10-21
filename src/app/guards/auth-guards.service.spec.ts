import { TestBed } from '@angular/core/testing';

import { AuthGuards } from './auth-guards.service';

describe('AuthGuards', () => {
  let service: AuthGuards;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuards);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
