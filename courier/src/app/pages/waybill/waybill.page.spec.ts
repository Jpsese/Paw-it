import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaybillPage } from './waybill.page';

describe('WaybillPage', () => {
  let component: WaybillPage;
  let fixture: ComponentFixture<WaybillPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaybillPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaybillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
