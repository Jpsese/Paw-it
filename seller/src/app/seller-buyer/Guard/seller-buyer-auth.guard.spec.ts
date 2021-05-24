import { TestBed, async, inject } from '@angular/core/testing';

import { SellerBuyerAuthGuard } from './seller-buyer-auth.guard';

describe('SellerBuyerAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellerBuyerAuthGuard]
    });
  });

  it('should ...', inject([SellerBuyerAuthGuard], (guard: SellerBuyerAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
