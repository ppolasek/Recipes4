import { Component, Input, OnInit } from '@angular/core';
import { Recipes4Logger } from "../logger/logger";
import { Recipe } from "../../models/recipe_model";
import { WebLoggerService } from "../../services/logger_service";
import { WebRecipeService } from "../../services/recipe_service";

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

    this.recipeService.findMostViewed(this.listSize).subscribe(returnList => {
      this.recipes = returnList
      this.logger.finer('MostViewedComponent.ngOnInit() this.recipes.length = ' + (this.recipes ? this.recipes.length : 'undefined'));
    });
  }
}
