// Copyright (c) 2018, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import { WebService } from "./common_services";
import { Observable } from "rxjs";
import { Recipe, RecipeTag, SearchCriteria } from "../models/recipe_model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Recipes4AppConfig } from "../models/model";
import { Recipes4Logger } from "../components/logger/logger";
import { catchError, map, tap } from "rxjs/operators";
import {WebLoggerService} from "./logger_service";

/// RecipeService interface definition
///
export interface RecipeService extends WebService {

  getRecipe(id: number): Observable<Recipe>;
  getRecipeWithHistory(id: number): Observable<Recipe>;
  saveRecipe(recipe: Recipe): Observable<Recipe>;
  createRecipe(recipe: Recipe): Observable<Recipe>;
  deleteRecipe(recipeId: number): Observable<boolean>;
  getAllRecipeTags(): Observable<Array<RecipeTag>>;
  findAddedRecently(count: number): Observable<Array<Recipe>>;
  findMostViewed(count: number): Observable<Array<Recipe>>;
  recipeSearch(criteria: SearchCriteria): Observable<Array<Recipe>>;
}

/// RecipeService implementation
///
@Injectable()
export class WebRecipeService extends WebService implements RecipeService {
  private mylog: Recipes4Logger = new Recipes4Logger(this.loggerService, 'WebRecipeService');

  constructor(protected loggerService: WebLoggerService, http: HttpClient, config: Recipes4AppConfig) {
    super(loggerService, http, config)
  }

  findMostViewed(count: number): Observable<Array<Recipe>> {
    return this.makeTheCall('findMostViewed', count)
      .pipe(
        tap(response => {
          this.mylog.fine(`findMostViewed() response = ${response.value}`);
        }),
        map(response => {
          let returnList: Array<Recipe> = Recipe.fromList(response.value);
          this.mylog.fine(`findMostViewed() returnList = ${returnList}`);
          return returnList;
        }),
        catchError(this.handleError<Array<Recipe>>(`findMostViewed() count: ${count}`))
      );
  }

  findAddedRecently(count: number): Observable<Array<Recipe>> {
    return this.makeTheCall('findAddedRecently', count)
      .pipe(
        tap(response => {
          this.mylog.fine(`findAddedRecently() response = ${response.value}`);
        }),
        map(response => {
          let returnList: Array<Recipe> = Recipe.fromList(response.value);
          this.mylog.fine('findAddedRecently() returnList = ' + (returnList ? returnList : 'undefined'));
          return returnList;
        }),
        catchError(this.handleError<Array<Recipe>>(`findAddedRecently() count: ${count}`))
      );
  }

  getRecipe(id: number): Observable<Recipe> {
    return this.makeTheCall('getRecipe', id)
      .pipe(
        tap(response => {
          this.mylog.fine(`getRecipe() response = ${response.value}`);
        }),
        map(response => {
          let recipe: Recipe = Recipe.fromJson(response.value);
          this.mylog.fine(`getRecipe() recipe = ${recipe}`);
          return recipe;
        }),
        catchError(this.handleError<Recipe>(`getRecipe() id: ${id}`))
      );
  }

  getRecipeWithHistory(id: number): Observable<Recipe> {
    return this.makeTheCall('getRecipeWithHistory', id)
      .pipe(
        tap(response => {
          this.mylog.fine(`getRecipeWithHistory() response = ${response.value}`);
        }),
        map(response => {
          let recipe: Recipe = Recipe.fromJson(response.value);
          this.mylog.fine(`getRecipeWithHistory() recipe = ${recipe}`);
          return recipe;
        }),
        catchError(this.handleError<Recipe>(`getRecipeWithHistory() id: ${id}`))
      );
  }

  saveRecipe(recipe: Recipe): Observable<Recipe> {
    return this.makeTheCall('saveRecipe', recipe)
      .pipe(
        tap(response => {
          this.mylog.fine(`saveRecipe() response = ${response.value}`);
        }),
        map(response => {
          let recipe: Recipe = Recipe.fromJson(response.value);
          this.mylog.fine(`saveRecipe() recipe = ${recipe}`);
          return recipe;
        }),
        catchError(this.handleError<Recipe>(`saveRecipe() recipe: ${recipe}`))
      );
  }

  createRecipe(recipe: Recipe): Observable<Recipe> {
    return this.makeTheCall('createRecipe', recipe)
      .pipe(
        tap(response => {
          this.mylog.fine(`createRecipe() response = ${response.value}`);
        }),
        map(response => {
          let recipe: Recipe = Recipe.fromJson(response.value);
          this.mylog.fine(`createRecipe() recipe = ${recipe}`);
          return recipe;
        }),
        catchError(this.handleError<Recipe>(`createRecipe() recipe: ${recipe}`))
      );
  }

  deleteRecipe(recipeId: number): Observable<boolean> {
    return this.makeTheCall('deleteRecipe', recipeId)
      .pipe(
        tap(response => {
          this.mylog.fine(`deleteRecipe() response = ${response.value}`);
        }),
        map(response => {
          this.mylog.fine(`deleteRecipe() response = ${response.value}`);
          return response.value;
        }),
        catchError(this.handleError<Recipe>(`deleteRecipe() recipeId: ${recipeId}`))
      );
  }

  getAllRecipeTags(): Observable<Array<RecipeTag>> {
    return this.makeTheCall('getAllRecipeTags', null)
      .pipe(
        // tap(response => {
        //   this.mylog.fine(`getAllRecipeTags() response = ${response.value}`);
        // }),
        map(response => {
          let recipeTags: Array<RecipeTag> = RecipeTag.fromList(response.value);
          this.mylog.fine(`getAllRecipeTags() recipeTags = ${recipeTags}`);
          return recipeTags;
        }),
        catchError(this.handleError<Array<RecipeTag>>(`getAllRecipeTags()`))
      );
  }

  recipeSearch(criteria: SearchCriteria): Observable<Array<Recipe>> {
    return this.makeTheCall('recipeSearch', criteria)
      .pipe(
        tap(response => {
          this.mylog.fine(`recipeSearch() response = ${response.value}`);
        }),
        map(response => {
          let returnList: Array<Recipe> = Recipe.fromList(response.value);
          this.mylog.fine(`recipeSearch() returnList = ${returnList}`);
          return returnList;
        }),
        catchError(this.handleError<Array<Recipe>>(`recipeSearch() criteria: ${criteria}`))
      );
  }
}
