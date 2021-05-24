import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingpagePage } from './trackingpage.page';

describe('TrackingpagePage', () => {
  let component: TrackingpagePage;
  let fixture: ComponentFixture<TrackingpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingpagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
