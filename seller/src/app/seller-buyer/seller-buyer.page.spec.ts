import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerBuyerPage } from './seller-buyer.page';

describe('SellerBuyerPage', () => {
  let component: SellerBuyerPage;
  let fixture: ComponentFixture<SellerBuyerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerBuyerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerBuyerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
