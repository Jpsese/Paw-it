import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostParcelPage } from './post-parcel.page';

describe('PostParcelPage', () => {
  let component: PostParcelPage;
  let fixture: ComponentFixture<PostParcelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostParcelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostParcelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
