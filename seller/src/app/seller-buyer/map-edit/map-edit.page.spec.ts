import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEditPage } from './map-edit.page';

describe('MapEditPage', () => {
  let component: MapEditPage;
  let fixture: ComponentFixture<MapEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
