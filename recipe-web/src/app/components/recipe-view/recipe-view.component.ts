import { Component, Input, OnInit } from '@angular/core';
import { Recipes4Logger } from "../logger/logger";
import { WebLoggerService } from "../../services/logger_service";
import { WebRecipeService } from "../../services/recipe_service";
import { Recipe } from "../../models/recipe_model";
import {ActivatedRoute, Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import {RecipeAppEvent} from "../../recipe-app-event";

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent implements OnInit {
  private logger: Recipes4Logger = new Recipes4Logger(this.loggerService, 'RecipeViewComponent');

  @Input()
  recipe: Recipe = null;

  editRecipeDialogVisible: boolean = false;

  constructor(
      private loggerService: WebLoggerService,
      private recipeService: WebRecipeService,
      private route: ActivatedRoute,
      private router: Router,
      private recipeAppEvent: RecipeAppEvent,
  ) {}

  ngOnInit() {
    this.logger.fine('ngOnInit()');

    this.route.paramMap.subscribe(params => {
      this.logger.fine('ngOnInit() params.get(\'id\') = ' + params.get('id'));
      let id = +params.get('id');
      this.logger.fine('ngOnInit() id = ' + id);

      this.recipeService.getRecipe(id).subscribe(recipe => this.recipe = recipe);
    });
  }

  onRecipeSaved(event: Map<String, any>) {
    this.logger.fine('onRecipeSaved() event = ' + event);
    if (event != null && event['recipe'] != null) {
      this.recipe = event['recipe'];
    }
  }

  onEditClick() {
    this.logger.fine('onEditClick() id = ' + this.recipe.id);
    this.editRecipeDialogVisible = true;
  }

  onDeleteClick() {
    this.logger.fine('onDeleteClick() id = ' + this.recipe.id);
    this.recipeService.deleteRecipe(this.recipe.id).subscribe((success) => {
      this.logger.fine('onDeleteClick() success = ' + success);
      if (success === true) {
        this.recipeAppEvent.recipeDeleted.next(this.recipe);

        this.router.navigate(['/home']);
      }
    });
  }
}
