import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedRecentlyComponent } from './added-recently.component';

describe('AddedRecentlyComponent', () => {
  let component: AddedRecentlyComponent;
  let fixture: ComponentFixture<AddedRecentlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddedRecentlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedRecentlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
