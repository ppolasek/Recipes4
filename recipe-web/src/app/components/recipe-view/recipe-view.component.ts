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
  recipe: Recipe = null;

  editRecipeDialogVisible: boolean = false;

  constructor(
      private loggerService: WebLoggerService,
      private recipeService: WebRecipeService,
      private route: ActivatedRoute) { }

  ngOnInit() {
    this.logger.fine('ngOnInit()');

    // const id = +this.route.snapshot.paramMap.get('id');
    // this.logger.fine('ngOnInit() id = ' + id);

    this.route.paramMap.subscribe(params => {
      this.logger.fine('ngOnInit() params.get(\'id\') = ' + params.get('id'));
      let id = +params.get('id');
      this.logger.fine('ngOnInit() id = ' + id);

      this.recipeService.getRecipe(id).subscribe(recipe => this.recipe = recipe);
    });
  }

  onRecipeSaved(event) {
    this.logger.fine('onRecipeSaved() event = ' + event);
    // if (event != null && event['recipe'] != null) {
    //   recipe = event['recipe'];
    // }
  }

  onEditClick() {
    this.logger.fine('onEditClick() id = ' + this.recipe.id);
    this.editRecipeDialogVisible = true;
  }

  onDeleteClick() {
    this.logger.fine('onDeleteClick() event = ' + event);
    // _recipeService.deleteRecipe(recipe.id).then((success) {
    //   if (success) _recipeEvents.recipeDeleted(recipe.id);
    // });
  }
}
