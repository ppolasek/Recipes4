import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Recipes4Logger } from "../logger/logger";
import { timer } from "rxjs/observable/timer";
import { SelectorDirective } from "../selector-directive";
import { WebLoggerService } from "../../services/logger_service";
import { WebRecipeService } from "../../services/recipe_service";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {Recipe, RecipeTag, RecipeTagEventType, SearchCriteria} from "../../models/recipe_model";
import {RecipeTagEvent} from "../recipe-tag/recipe-tag-event";
import { RecipeUtil } from "../../util/recipe_util";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private logger: Recipes4Logger = new Recipes4Logger(this.loggerService, 'SearchComponent');

  searchText: string = '';
  allTags: Array<RecipeTag>;
  recipeTags: Array<RecipeTag> = [];
  recipes: Array<Recipe> = [];

  @ViewChild('recipeTagList')
  recipeTagListRef: ElementRef;

  hoveredRecipe: Recipe = null;

  private timer: any = timer(1000, 1000);
  private criteria: SearchCriteria = new SearchCriteria();

  private searchTerms = new Subject<string>();


  constructor(
    private loggerService: WebLoggerService,
    private recipeService: WebRecipeService,
    private selector: SelectorDirective,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadRecipeTags();

    // this.searchTerms.pipe(
    //   debounceTime(500),
    //
    //   distinctUntilChanged(),
    //
    //   do((term: string) => this.doSearch()),
    // );
/*
    this.heroes$ = this.searchTerms.pipe(
      // wait 300 ms after each keystroke before considering the search term
      debounceTime(300),

      // ignore new term if same as the previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );

 */
  }

  onRecipeHovered(event) {
    this.logger.fine('onRecipeHovered() event = $event');
    // TODO if (event != null && event['recipe'] != null) {
    //   hoveredRecipe = event['recipe'];
    // }
  }

  onCloseSearchClick() {
    this.router.navigate(['/home']);
  }

  onKey(value: string) {
    this.searchText = value;
    this.logger.fine('onKey() value = ' + value + ', searchText = ' + this.searchText);

    this.searchTerms.next(value);

    // if (value != null && value.length > 0) {
    //   // perform a search on the text after a half-second delay
    //   if (_timer != null && _timer.isActive) {
    //     _timer.cancel();
    //   }
    //   _timer = new Timer(new Duration(milliseconds: 500), _doSearch);
    // } else {
    //   _timer?.cancel();
    // }
  }

  /// Fires when an input value appears, but ignore those not in the dropdown
  /// list, as those are manual entries from the keyboard.
  onTagInput(value) {
    this.logger.fine('onTagInput() value = ' + value);

    if (this.allTags !== null && this.allTags.length > 0) {
      let tempTag = this.allTags.find(function (rtag) {
        return rtag.tagName === this;
      }, value );

      if (tempTag != null) {
        this.logger.fine('onTagInput() this is from the dropdown. keeping ' + value + ' & clearing the selection');

        // this is a tag from the dropdown list, so keep it as the selected item
        this.recipeTags.push(tempTag);
        // perform a search when a tag has been selected
        this.doSearch();

        // and remove the tag from the selection
        this.allTags = this.allTags.filter(item => item !== tempTag);

        this.recipeTagListRef.nativeElement.value = null;
      }
    }
  }

  /// handle events related to tags being added & removed from this recipe.
  onTagEvent(event: RecipeTagEvent) {
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
        this.recipeTags = this.recipeTags.filter((tag) => tag.tagName !== event.tag.tagName);
        // perform a search when a tag has been removed
        this.doSearch();
      } else {
        this.logger.finer('onTagEvent() removing tag by id');
        this.recipeTags = this.recipeTags.filter((tag) => tag.id !== event.tag.id);
        // perform a search when a tag has been removed
        this.doSearch();
      }
    }
  }

  private doSearch() {
    this.logger.fine('doSearch()');

    this.criteria.searchText = this.searchText;
    this.criteria.tags = this.recipeTags;
    this.logger.fine('_doSearch() _criteria = $_criteria');

    /*
        const id = +this.route.snapshot.paramMap.get('id');
        this.heroService.getHero(id).subscribe(hero => this.hero = hero);

     */

    // if there's no search criteria then skip the search
    if (this.criteria.isValid()) {
      this.recipeService.recipeSearch(this.criteria)
        .subscribe(list => this.recipes = list);

      this.logger.fine('_doSearch() recipes.length = ' + this.recipes.length);
    } else {
      this.recipes = [];
    }
  }

  private loadRecipeTags() {
    this.recipeService.getAllRecipeTags()
      .subscribe(list => {
        this.logger.fine('loadRecipeTags() list = ' + list);
        RecipeUtil.sortRecipeTags(list);
        this.logger.fine('loadRecipeTags() sorted list = ' + list);
        this.allTags = list;
      });
  }
}
