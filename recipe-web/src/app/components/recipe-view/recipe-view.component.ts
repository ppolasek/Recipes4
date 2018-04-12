import { Component, Input, OnInit } from '@angular/core';
import { Recipes4Logger } from "../logger/logger";
import { WebLoggerService } from "../../services/logger_service";
import { WebRecipeService } from "../../services/recipe_service";
import { Recipe } from "../../models/recipe_model";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { tap, switchMap } from "rxjs/operators";
import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import "rxjs/add/operator/switchMap";

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent implements OnInit {
  private logger: Recipes4Logger = new Recipes4Logger(this.loggerService, 'RecipeViewComponent');

//  @Input()
  recipe: Observable<Recipe> = null;

  constructor(
      private loggerService: WebLoggerService,
      private recipeService: WebRecipeService,
      private route: ActivatedRoute) { }

  ngOnInit() {
    this.logger.fine('ngOnInit()');

    /*
    this.hero$ = this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.service.getHero(params.get('id')));
    */

    this.recipe = this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.logger.fine('ngOnInit() param id = ' + params.get('id'));

        let id: number = -1;
        if (params.get('id') !== null) {
          id = +params.get('id');
        }

        this.logger.fine('ngOnInit() number id = ' + id);

        return this.recipeService.getRecipe(id);
      });

    // this.recipe = this.route.paramMap
    //   .pipe(
    //     tap((params: ParamMap) => this.logger.fine('ngOnInit() param id = ' + params.get('id'))),
    //     switchMap((params: ParamMap) => {
    //       let id: number = -1;
    //       if (params.get('id') !== null) {
    //         id = +params.get('id');
    //       }
    //       return of(id);
    //     }),
    //     tap((id: number) => this.logger.fine('ngOnInit() number id = ' + id)),
    //     switchMap((id: number) => {
    //       return this.recipeService.getRecipe(id);
    //     })
    //   );

    // let id = _routeParams?.get('id');
    // this.logger.fine('ngOnInit() id = ' + id);

    // if (_id != null) {
    //   var id = int.parse(_id, onError :(_) => null);
    //   this.logger.fine('ngOnInit() id = $id');
    //   recipe = await  _recipeService.getRecipe(id);
    // }
  }
/*

  ngOnInit() async {
    this.logger.loggerName = 'RecipeViewComponent';
  }
*/
  onRecipeSaved(event) {
    this.logger.fine('onRecipeSaved() event = ' + event);
    // if (event != null && event['recipe'] != null) {
    //   recipe = event['recipe'];
    // }
  }

  onEditClick() {
    this.logger.fine('onEditClick() event = ' + event);
    // editRecipeDialogComp.visible = true;
  }

  onDeleteClick() {
    this.logger.fine('onDeleteClick() event = ' + event);
    // _recipeService.deleteRecipe(recipe.id).then((success) {
    //   if (success) _recipeEvents.recipeDeleted(recipe.id);
    // });
  }
}
