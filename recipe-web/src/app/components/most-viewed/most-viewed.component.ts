import { Component, Input, OnInit } from '@angular/core';

import { Recipe } from "@app/models";
import { Recipes4Logger, WebLoggerService, WebRecipeService } from "@app/core";
import { RecipeAppEvent } from "../../recipe-app-event";

@Component({
  selector: 'app-most-viewed',
  templateUrl: './most-viewed.component.html',
  styleUrls: ['./most-viewed.component.css']
})
export class MostViewedComponent implements OnInit {
  private logger: Recipes4Logger = new Recipes4Logger(this.loggerService, 'MostViewedComponent');

  @Input()
  listSize: number;
  // listSize: Observable<number>;

  recipes: Recipe[];

  constructor(
    private recipeService: WebRecipeService,
    private loggerService: WebLoggerService,
    private recipeAppEvent: RecipeAppEvent,
  ) {}

  ngOnInit() {
    this.logger.fine('MostViewedComponent.ngOnInit() listSize = ' + this.listSize);
    // this is throwing an error: ERROR TypeError: this.listSize.pipe is not a function
    // listSize may have been declared as an Observable, but when it is passed
    // in as an HTML attribute it is changed to a number.
    // this.recipes2 = this.listSize.pipe(
    //   tap(size => this.logger.fine(`listSize = ${size}`)),
    //   switchMap(size => this.recipeService.findAddedRecently(size))
    // );

    this.fetchRecipes();
    this.recipeAppEvent.recipeClicked.subscribe((clickedRecipe) => this.fetchRecipes());
    this.recipeAppEvent.recipeDeleted.subscribe((deletedRecipe) => this.fetchRecipes());
  }

  ngOnDestroy() {
    this.recipeAppEvent.recipeClicked.unsubscribe();
    this.recipeAppEvent.recipeDeleted.unsubscribe();
  }

  private fetchRecipes() {
    this.recipeService.findMostViewed(this.listSize).subscribe(returnList => {
      this.recipes = returnList
      this.logger.finer('fetchRecipes() this.recipes.length = ' + (this.recipes ? this.recipes.length : 'undefined'));
    });
  }
}
