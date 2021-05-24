import { TestBed, async, inject } from '@angular/core/testing';

import { CourierAuthGuard } from './courier-auth.guard';

describe('CourierAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourierAuthGuard]
    });
  });

  it('should ...', inject([CourierAuthGuard], (guard: CourierAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
