import { Component, Input, OnInit} from '@angular/core';

import { Observable} from "rxjs/Observable";
import { tap, filter, map, switchMap, withLatestFrom} from "rxjs/operators";

import { Recipe} from "../../models/recipe_model";
import { RecipeService, WebRecipeService } from "../../services/recipe_service";
import { Recipes4Logger } from "../logger/logger";
import { WebLoggerService } from "../../services/logger_service";

@Component({
  selector: 'app-added-recently',
  templateUrl: './added-recently.component.html',
  styleUrls: ['./added-recently.component.css']
})
export class AddedRecentlyComponent implements OnInit {
  private logger: Recipes4Logger = new Recipes4Logger(this.loggerService, 'AddedRecentlyComponent');

  @Input()
  listSize: number;
  // listSize: Observable<number>;

  recipes: Recipe[];

  constructor(
    private recipeService: WebRecipeService,
    private loggerService: WebLoggerService,
  ) {}

  ngOnInit() {
    this.logger.fine('AddedRecentlyComponent.ngOnInit() listSize = ' + this.listSize);
    // // this is throwing an error: ERROR TypeError: this.listSize.pipe is not a function
    // // listSize may have been declared as an Observable, but when it is passed
    // // in as an HTML attribute it is changed to a number.
    // this.recipes2 = this.listSize.pipe(
    //   tap(size => this.logger.fine(`listSize = ${size}`)),
    //   switchMap(size => this.recipeService.findAddedRecently(size))
    // );

    this.recipeService.findAddedRecently(this.listSize).subscribe(returnList => {
      this.recipes = returnList
      this.logger.finer('AddedRecentlyComponent.ngOnInit() this.recipes.length = ' + (this.recipes ? this.recipes.length : 'undefined'));
    });
  }

}
