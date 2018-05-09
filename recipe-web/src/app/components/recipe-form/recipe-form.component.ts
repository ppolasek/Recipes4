import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WebLoggerService } from "../../services/logger_service";
import { Recipes4Logger } from "../logger/logger";
import {Recipe, RecipeTag, RecipeTagEventType} from "../../models/recipe_model";
import { Cookbook } from "../../models/cookbook_model";
import { WebRecipeService } from "../../services/recipe_service";
import { WebCookbookService } from "../../services/cookbook_service";
import { HttpErrorResponse } from "@angular/common/http";
import { RecipeUtil } from "../../util/recipe_util";
import {RecipeAppEvent} from "../../recipe-app-event";

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

  allTags: Array<RecipeTag> = [];

  cookbookList: Array<Cookbook>;
  showCookbooks: boolean = true;
  recipetag: string;

  _isNewCookbook: boolean = false;

  constructor(
      private loggerService: WebLoggerService,
      private recipeService: WebRecipeService,
      private cookbookService: WebCookbookService,
      private recipeAppEvent: RecipeAppEvent,
  ) { }

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
            this.recipeAppEvent.recipeAdded.next(updatedRecipe);

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
            this.recipeAppEvent.recipeUpdated.next(updatedRecipe);

            // if the call succeeded and there was a new cookbook then
            // reload them
            if (updatedRecipe !== null && this._isNewCookbook) {
              this._loadCookbooks();
            }

            this.close();
          });
      }
    }
  }

  isSelected(name: string): string {
    if (name === this.cookbookTitle) {
      return 'selected';
    }
    return '';
  }

  /// Take the tag name from the input box if the user presses the enter key.
  onTagKeyUp(event) {
    this.logger.fine('onTagKeyUp() recipetag = ' + this.recipetag + ', event.runtimeType = ' + event.runtimeType);
    this.logger.fine('onTagKeyUp() event.keyCode = ' + event.keyCode);
    this.logger.fine('onTagKeyUp() event.which = ' + event.which);

    if (event.keyCode === 13 || event.which === 13) {
      if (this.recipetag !== null && this.recipetag.length > 0) {
        this.logger.fine('onTagKeyUp() enter key pressed. keeping ' + this.recipetag + ' & clearing the selection');

        // convert the entered tag to start with an upper-case letter and the rest to lower-case,
        // and then create a tag from it
        this.recipe.recipeTags.push(RecipeTag.fromValues(RecipeUtil.toTitleCaseAll(this.recipetag)));
      }

      this.recipetag = null;
    }
  }

  /// Fires when an input value appears, but ignore those not in the dropdown
  /// list, as those are manual entries from the keyboard.
  onTagInput(inputvalue) {
    this.logger.fine('onTagInput() inputvalue = ' + inputvalue);

    if (this.allTags !== null && this.allTags.length > 0) {

      let tempTag = this.allTags.find(function (rtag) {
          return rtag.tagName === this;
      }, inputvalue);

      this.logger.fine('onTagInput() tempTag = ' + tempTag);

      if (tempTag !== undefined && tempTag !== null) {
        this.logger.fine(
            'onTagInput() this is from the dropdown. keeping ' + inputvalue +
            ' & clearing the selection');

        // this is a tag from the dropdown list, so keep it as the selected item
        this.recipe.recipeTags.push(tempTag);

        // and remove the tag from the selection
        this.allTags = this.allTags.filter(item => item !== tempTag);

        this.recipeTagListRef.nativeElement.value = null;
      }
    }
  }

  /// handle events related to tags being added & removed from this recipe.
  onTagEvent(event) {
    this.logger.fine('onTagEvent() event = ' + event);

    // Remove this tag from the list of tags.
    if (RecipeTagEventType.DELETE == event.type) {
      // if the tag was pre-existing,
      // add the deleted tag back to the 'allTags' list
      if (!event.tag.isNew()) {
        this.allTags.push(event.tag);
        RecipeUtil.sortRecipeTags(this.allTags);
      }

      if (event.tag.isNew()) {
        this.logger.finer('onTagEvent() removing tag by name');
        this.recipe.recipeTags = this.recipe.recipeTags.filter((tag) => tag.tagName !== event.tag.tagName);
      } else {
        this.logger.finer('onTagEvent() removing tag by id');
        this.recipe.recipeTags = this.recipe.recipeTags.filter((tag) => tag.id !== event.tag.id);
      }
    }
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
    this.logger.fine('_recipeChanged() recipe = ' + this.recipe);
    if (this.recipe !== null && this.recipe.cookbook !== null && this.recipe.cookbook.name !== null) {
      this.logger.fine('_recipeChanged() setting cookbookTitle to: ' + this.recipe.cookbook.name);
      this.cookbookTitle = this.recipe.cookbook.name;
    }
  }
}
