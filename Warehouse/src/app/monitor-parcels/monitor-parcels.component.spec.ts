import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorParcelsComponent } from './monitor-parcels.component';

describe('MonitorParcelsComponent', () => {
  let component: MonitorParcelsComponent;
  let fixture: ComponentFixture<MonitorParcelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorParcelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorParcelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
