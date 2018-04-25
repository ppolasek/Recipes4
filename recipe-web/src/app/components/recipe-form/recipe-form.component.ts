import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WebLoggerService } from "../../services/logger_service";
import { Recipes4Logger } from "../logger/logger";
import { Recipe, RecipeTag } from "../../models/recipe_model";
import { Cookbook } from "../../models/cookbook_model";
import { WebRecipeService } from "../../services/recipe_service";
import { WebCookbookService } from "../../services/cookbook_service";
import { HttpErrorResponse } from "@angular/common/http";
import { RecipeUtil } from "../../util/recipe_util";

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {
  private logger: Recipes4Logger = new Recipes4Logger(this.loggerService, 'RecipeFormComponent');

  @Input()
  heading: string;

  @Input()
  buttonLabel: string = '';

  @Input()
  visible: boolean = false;

  @Input()
  set recipe(newValue: Recipe) {
    this.logger.finest(`RecipeFormComponent.set recipe() newValue = ${newValue}`);
    if (newValue !== this._recipe) {
      this._recipe = newValue;
      this._recipeChanged();
    }
  }

  _recipe: Recipe = new Recipe();
  get recipe(): Recipe {
    return this._recipe;
  }

  @Output('close')
  closeEvent = new EventEmitter();

  @Output('recipeSaved')
  recipeSaved = new EventEmitter();


  _cookbookTitle: string;
  get cookbookTitle() {
      return this._cookbookTitle;
  }
  set cookbookTitle(newValue: string) {
    if (newValue !== this._cookbookTitle) {
      this._cookbookTitle = newValue;
      this._cookbookTitleChanged();
    }
  }

  _cookbookName: string;
  get cookbookName(): string {
    return this._cookbookName;
  }
  set cookbookName(newValue: string) {
    if (newValue !== null) {
      this._cookbookName = newValue;
      this._cookbookNameChanged();
    }
  }

  allTags: Array<RecipeTag>;

  get diagnostic(): string {
    return `DIAGNOSTIC: ${this.recipe}, cookbookTitle: ${this.cookbookTitle}, cookbookName: ${this.cookbookName}`;
  }

  cookbookList: Array<Cookbook>;
  showCookbooks: boolean = true;
  recipetag: string;

  _isNewCookbook: boolean = false;

  constructor(private loggerService: WebLoggerService, private recipeService: WebRecipeService, private cookbookService: WebCookbookService) { }

  ngOnInit() {
    this.logger.fine('ngOnInit()');
    this.logger.finest('ngOnInit() heading = ' + this.heading);
    this.logger.finest('ngOnInit() buttonLabel = ' + this.buttonLabel);

    this.recipe = new Recipe();

    this._loadCookbooks();
    this._loadRecipeTags();
  }

  @ViewChild('recipeTagListRef')
  recipeTagListRef: ElementRef;

  onSubmitClick() {
    this.logger.fine('onSubmitClick() cookbookTitle = ' + this.cookbookTitle);
    this.logger.fine('onSubmitClick() cookbookName = ' + this.cookbookName);
    this.logger.fine('onSubmitClick() recipe = ' + this.recipe);
    this.logger.fine('onSubmitClick() recipe.isValid() = ' + this.recipe.isValid());
    this.logger.fine('onSubmitClick() recipe.isNew() = ' + this.recipe.isNew());

    if (this.recipe.isValid() === true) {
      if (this.recipe.isNew() === true) {
        // This is a new recipe so call 'create' instead of 'save'
        this.recipeService.createRecipe(this.recipe).subscribe(
          updatedRecipe => {
            this.logger.fine('onSubmitClick() updatedRecipe = ' + updatedRecipe);

            // null the current recipe, and get the new list of tags
            this.recipe = new Recipe();
            this._loadRecipeTags();

            // // Event from this component only
            this.recipeSaved.emit({'recipe': updatedRecipe});

            // Notifies application-wide components that a recipe was updated
            // TODO still need to figure this out: this.recipeEvents.recipeAdded(updatedRecipe.id);

            // if the call succeeded and there was a new cookbook then
            // reload them
            if (updatedRecipe !== null && this._isNewCookbook) {
              this._loadCookbooks();
            }

          this.close();
        });
      } else {
        // This is an existing recipe so call 'save' instead of 'create'
        this.recipeService.saveRecipe(this.recipe).subscribe(
          updatedRecipe => {
            this.logger.fine('onSubmitClick() updatedRecipe = ' + updatedRecipe);

            // null the current recipe, and get the new list of tags
            this.recipe = new Recipe();
            this._loadRecipeTags();

            // // Event from this component only
            this.recipeSaved.emit({'recipe': updatedRecipe});

            // Notifies application-wide components that a recipe was updated
            // TODO still need to figure this out: this.recipeEvents.recipeAdded(updatedRecipe.id);

            // if the call succeeded and there was a new cookbook then
            // reload them
            if (updatedRecipe !== null && this._isNewCookbook) {
              this._loadCookbooks();
            }

            this.close();
          });
      // TODO } else {
      //   // This is an existing recipe so call 'save' instead of 'create'
      //   _recipeService.saveRecipe(recipe).then((updatedRecipe) {
      //     this.logger.fine('onSubmitClick() updatedRecipe = $updatedRecipe');
      //
      //     // null the current recipe, and get the new list of tags
      //     recipe = new Recipe();
      //     _loadRecipeTags();
      //
      //     // Event from this component only
      //     _recipeSavedController.add({'recipe': updatedRecipe});
      //
      //     // Notifies application-wide components that a recipe was updated
      //     _recipeEvents.recipeUpdated(updatedRecipe.id);
      //
      //     // if the call succeeded and there was a new cookbook given then
      //     // reload them
      //     if (updatedRecipe !== null && _isNewCookbook) {
      //       _loadCookbooks();
      //     }
      //
      //     dialog.visible = false;
      //   });
      }
    }
  }

  /// Take the tag name from the input box if the user presses the enter key.
  onTagKeyUp(event) {
    this.logger.fine('onTagKeyUp() recipetag = $recipetag, event.runtimeType = ' + event.runtimeType);

    // TODO if (event.keyCode === 13 || event.which === 13) {
    //   if (recipetag !== null && recipetag.isNotEmpty) {
    //     this.logger.fine('onTagKeyUp() enter key pressed. keeping $recipetag & clearing the selection');
    //
    //     // convert the entered tag to start with an upper-case letter and the rest to lower-case,
    //     // and then create a tag from it
    //     recipe.recipeTags.add(new RecipeTag.fromValues(RecipeUtil.toTitleCaseAll(recipetag)));
    //   }
    //
    //   recipetag = null;
    // }
  }

  /// Fires when an input value appears, but ignore those not in the dropdown
  /// list, as those are manual entries from the keyboard.
  onTagInput(event) {
    this.logger.fine('onTagInput() recipeTagListRef.nativeElement.value = ' + this.recipeTagListRef.nativeElement.value);

    // TODO if (allTags !== null && allTags.isNotEmpty) {
    //   var tempTag =
    //       allTags.firstWhere((rtag) => rtag.tagName === recipeTagListRef.nativeElement.value, orElse: () => null);
    //
    //   if (tempTag !== null) {
    //     this.logger.fine(
    //         'onTagInput() this is from the dropdown. keeping ${recipeTagListRef.nativeElement.value} & clearing the selection');
    //
    //     // this is a tag from the dropdown list, so keep it as the selected item
    //     recipe.recipeTags.add(tempTag);
    //
    //     // and remove the tag from the selection
    //     allTags.remove(tempTag);
    //
    //     recipeTagListRef.nativeElement.value = null;
    //   }
    // }
  }

  /// handle events related to tags being added & removed from this recipe.
  onTagEvent(event) {
    this.logger.fine('onTagEvent() event = ' + event);

    // // remove this tag from the list of tags
    // TODO if (RecipeTagEvent.DELETE === event[RecipeTagEvent.TYPE]) {
    //   var eventTag = new RecipeTag.fromJson(event[RecipeTagEvent.TAG]);
    //   this.logger.finest('onTagEvent() eventTag = $eventTag');
    //
    //   // if the tag was pre-existing,
    //   // add the deleted tag back to the 'allTags' list
    //   if (!eventTag.isNew) {
    //     allTags.add(eventTag);
    //     allTags.sort((a, b) => a.tagName.compareTo(b.tagName));
    //   }
    //
    //   if (eventTag.isNew) {
    //     this.logger.finer('onTagEvent() removing tag by name');
    //     recipe.recipeTags?.removeWhere((tag) => tag.tagName === eventTag.tagName);
    //   } else {
    //     this.logger.finer('onTagEvent() removing tag by id');
    //     recipe.recipeTags?.removeWhere((tag) => tag.id === eventTag.id);
    //   }
    // }
  }

  close() {
    this.visible = false;
    this.closeEvent.emit();
  }

  _loadCookbooks() {
    this.cookbookService.getAllCookbooks().subscribe(
      list => {
        this.cookbookList = list;
        this.logger.fine(`_loadCookbooks() cookbookList = ${this.cookbookList}`);
        this.showCookbooks = this.cookbookList !== null && this.cookbookList.length > 0;
        this.logger.fine(`_loadCookbooks() showCookbooks = ${this.showCookbooks}`);
      },
      (err: HttpErrorResponse) => {
        this.logger.severe(`WebLoggerService.log data: ${err}`);
        this.logger.severe(err);
      });
  }

  _loadRecipeTags() {
    this.recipeService.getAllRecipeTags().subscribe(
      list => {
        this.allTags = list;
        RecipeUtil.sortRecipeTags(this.allTags);
        this.logger.fine(`_loadRecipeTags() allTags = ${this.allTags}`);
      }
    );
  }

  _cookbookTitleChanged() {
    if (this.cookbookList !== undefined && this.cookbookList !== null && this.cookbookList.length > 0 && this.cookbookTitle !== null && this.cookbookTitle.length > 0) {
      let cookbook = this.cookbookList.find(function (cookbook) {
        return cookbook.name === this;
      }, this.cookbookTitle); // See Also: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
      this.logger.fine('_cookbookTitleChanged() cookbook = ' + cookbook);
      this.recipe.cookbook = cookbook;
    }
  }

  _cookbookNameChanged() {
    if (this.cookbookName !== null && this.cookbookName.length > 0) {
      this.recipe.cookbook = new Cookbook(this.cookbookName);
      this._isNewCookbook = true;
    }
  }

  _recipeChanged() {
    if (this._recipe !== null && this._recipe.cookbook !== null && this._recipe.cookbook.name !== null) {
      this.cookbookTitle = this._recipe.cookbook.name;
    }
  }
}
