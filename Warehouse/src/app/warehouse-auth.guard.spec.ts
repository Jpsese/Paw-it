import { TestBed, async, inject } from '@angular/core/testing';

import { WarehouseAuthGuard } from './warehouse-auth.guard';

describe('WarehouseAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WarehouseAuthGuard]
    });
  });

  it('should ...', inject([WarehouseAuthGuard], (guard: WarehouseAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
