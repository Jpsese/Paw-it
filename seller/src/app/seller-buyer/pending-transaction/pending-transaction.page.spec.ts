import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTransactionPage } from './pending-transaction.page';

describe('PendingTransactionPage', () => {
  let component: PendingTransactionPage;
  let fixture: ComponentFixture<PendingTransactionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingTransactionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingTransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
