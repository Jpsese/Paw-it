import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingmodalPage } from './trackingmodal.page';

describe('TrackingmodalPage', () => {
  let component: TrackingmodalPage;
  let fixture: ComponentFixture<TrackingmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
