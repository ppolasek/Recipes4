import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Recipe } from "../../models/recipe_model";
import { Recipes4Logger } from "../logger/logger";
import { WebLoggerService } from "../../services/logger_service";
import { SelectorDirective } from "../selector-directive";
import { ActivatedRoute, Router } from "@angular/router";
import {RecipeViewComponent} from "../recipe-view/recipe-view.component";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  // final Recipes3Logger this.logger;
  // final RecipesAppEvents _recipeEvents;
  // final SelectorDirective this.selector;
  // final Router _router;
  private logger: Recipes4Logger = new Recipes4Logger(this.loggerService, 'RecipeListComponent');

  @Output('hovered') recipeHovered = new EventEmitter<Recipe>();

  _recipeList: Array<Recipe>;
  get recipeList(): Array<Recipe> {
    return this._recipeList
  };
  @Input()
  set recipeList(newValue: Array<Recipe>) {
    this._recipeList = newValue;
    this.onRecipeListChanged();
  }

  @Input()
  heading: string = '';

  // If this is true do not route to a separate view, but retrieve the recipe and display it below the list.
  @Input()
  enableHoverEvent: boolean = false;

  constructor(
      private loggerService: WebLoggerService,
      private selector: SelectorDirective,
      private route: ActivatedRoute,
      private router: Router
  ) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.selector != null && this.selector.subscription != null) {
      this.selector.subscription.unsubscribe();
    }
  }

  /// The user moved over the recipe, so remember it in case they hover long enough
  onMouseOver(id: number) {
    this.logger.fine('onMouseOver() id = ' + id);

    this.selector.subscription = this.selector.timer.subscribe(t => this.showHoveredRecipe(t));

    // need to keep track of the recipe being hovered over, so it can be displayed when the timer fires off
    if (this.recipeList !== null) {
      this.selector.hoveredRecipe = this.recipeList.find(function (temp) {
        return temp.id === this;
      }, id);
      this.logger.finest('onMouseOver() hoveredRecipe = ' + this.selector.hoveredRecipe);
    }
  }

  /// The user move off a recipe, so cancel the timer for showing that one recipe
  onMouseOut(id: number) {
    this.logger.fine('onMouseOut() id = ' + id);
    this.selector.subscription.unsubscribe();
  }

  /// The user specifically clicked on the recipe, so show it
  onMouseClick(id: number) {
    this.logger.fine('onMouseClick()');
    this.selector.subscription.unsubscribe();

    if (this.recipeList !== null) {
      this.selector.clickedRecipe = this.recipeList.find(function (temp) {
        return temp.id === this;
      }, id);
      this.logger.finest('onMouseClick() _clickedRecipe = ' + this.selector.clickedRecipe);
      this.selector.hoveredRecipe = null;
      this.showClickedRecipe(this.selector.clickedRecipe);
    }
  }

  private showHoveredRecipe(t) {
    this.logger.finer('_showHoveredRecipe() = ' + t);
    this.logger.finer('_showHoveredRecipe() _hoveredRecipe = ' + this.selector.hoveredRecipe);
    this.selector.subscription.unsubscribe();

    this.logger.finer('_showHoveredRecipe() this.enableHoverEvent = ' + this.enableHoverEvent);
    if (this.enableHoverEvent) {
      // not navigating to the hover page, but showing it below the list
      // recipeHovered.emit({...this.this.selector.hoveredRecipe});
    } else {
      if (this.selector.lastFired === null ||
        (this.selector.lastFired !== null &&
          this.selector.hoveredRecipe !== null
          && this.selector.hoveredRecipe.id !== this.selector.lastFired.id)) {

        this.selector.lastFired = this.selector.hoveredRecipe;
// TODO do we still need this:      _recipeEvents.hoverRecipe(this.selector.hoveredRecipe);

        // below doesn't cause an error with this: {path: 'hover', component: RecipeViewComponent}
        // this.router.navigate(['/hover', { 'id': this.selector.hoveredRecipe.id } ]);

        // below doesn't cause an error with this: {path: 'hover/:id', component: RecipeViewComponent},
        this.router.navigate(['hover', this.selector.hoveredRecipe.id]);

      } else if (this.selector.hoveredRecipe !== null) {
        this.logger.fine('_showHoveredRecipe() already fired event for $this.selector.hoveredRecipe');
      }
    }
  }

  /// Need to avoid the case where they hover over the recipe for a bit and then click on it. Do not fire the event
  /// twice for the same object
  private showClickedRecipe(recipe: Recipe) {
   this.logger.finer('_showClickedRecipe() recipe = ' + recipe);
   this.logger.finer('_showClickedRecipe() this.selector.lastFired = ' + this.selector.lastFired);

    // TODO finish converting this
// //    if (recipe !== null && recipe.id !== _lastFired?.id) {
//       this.selector.lastFired = recipe;
//       _router.navigate(['/Detail', {'id': recipe.id.toString()}]);
//       _recipeEvents.viewRecipe(recipe);
// //    } else if (recipe !== null) {
// //      this.logger.fine('_showClickedRecipe() already fired event for $recipe');
// //    }
  }


  /// The list was reloaded.
  private onRecipeListChanged() {
    this.logger.fine('onRecipeListChanged() this.selector.clickedRecipe.id = ' +
      (this.selector.clickedRecipe != null ? this.selector.clickedRecipe.id : 'null'));
  }
}
