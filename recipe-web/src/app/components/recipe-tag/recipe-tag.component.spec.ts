import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeTagComponent } from './recipe-tag.component';

describe('RecipeTagComponent', () => {
  let component: RecipeTagComponent;
  let fixture: ComponentFixture<RecipeTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
