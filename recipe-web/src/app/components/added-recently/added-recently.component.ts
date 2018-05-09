import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import { Observable} from "rxjs/Observable";
import { tap, filter, map, switchMap, withLatestFrom} from "rxjs/operators";

import { Recipe} from "../../models/recipe_model";
import { RecipeService, WebRecipeService } from "../../services/recipe_service";
import { Recipes4Logger } from "../logger/logger";
import { WebLoggerService } from "../../services/logger_service";
import {RecipeAppEvent} from "../../recipe-app-event";

@Component({
  selector: 'app-added-recently',
  templateUrl: './added-recently.component.html',
  styleUrls: ['./added-recently.component.css']
})
export class AddedRecentlyComponent implements OnInit, OnDestroy {
  private logger: Recipes4Logger = new Recipes4Logger(this.loggerService, 'AddedRecentlyComponent');

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
    this.logger.fine('ngOnInit() listSize = ' + this.listSize);
    // // this is throwing an error: ERROR TypeError: this.listSize.pipe is not a function
    // // listSize may have been declared as an Observable, but when it is passed
    // // in as an HTML attribute it is changed to a number.
    // this.recipes2 = this.listSize.pipe(
    //   tap(size => this.logger.fine(`listSize = ${size}`)),
    //   switchMap(size => this.recipeService.findAddedRecently(size))
    // );


    this.fetchRecipes();
    this.recipeAppEvent.recipeAdded.subscribe((addedRecipe) => this.fetchRecipes());
    this.recipeAppEvent.recipeDeleted.subscribe((deletedRecipe) => this.fetchRecipes());
  }

  ngOnDestroy() {
    this.recipeAppEvent.recipeAdded.unsubscribe();
    this.recipeAppEvent.recipeDeleted.unsubscribe();
  }

  private fetchRecipes() {
    this.recipeService.findAddedRecently(this.listSize).subscribe(returnList => {
      this.recipes = returnList
      this.logger.finer('fetchRecipes() this.recipes.length = ' + (this.recipes ? this.recipes.length : 'undefined'));
    });
  }
}
