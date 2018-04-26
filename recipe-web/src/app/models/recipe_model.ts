// Copyright (c) 2018, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import {DomainCommon} from "./model";
import {RecipeUtil} from "../util/recipe_util";
import {Cookbook} from "./cookbook_model";

export class RecipeTagEventType {
  static ADD: string = 'ADD';
  static DELETE: string = 'DELETE';
}

export class Recipe extends DomainCommon {
  recipeName: string = '';
  notes: string = '';
  cookbook: Cookbook = null;
  pageNrs: string = '';
  recipeUrl: string = '';
  assetName: string = '';
  isFavorite: boolean = false;
  recipeTags: Array<RecipeTag> = [];

  get recipeTagsSorted(): Array<RecipeTag> {
    if (this.recipeTags !== null && this.recipeTags.length > 1) {
      this.recipeTags.sort((r1, r2) => {
        if (r1.tagName.toLowerCase() < r2.tagName.toLowerCase()) {
          return -1;
        } else if (r1.tagName.toLowerCase() > r2.tagName.toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return this.recipeTags;
  }

  isValid(): boolean {
    return this.recipeName !== null && this.recipeName.length !== 0 &&
    (this.cookbook !== null || this.recipeUrl !== null);
  }

  toString(): string {
    return 'Recipe[' +
        super.toString() +
        ', recipeName: ' + this.recipeName +
        ', cookbook: ' + (this.cookbook !== null ? this.cookbook.toString() : 'null') +
        ', pageNrs: ' + (this.pageNrs !== null ? this.pageNrs : 'null') +
        ', recipeUrl: ' + (this.recipeUrl !== null ? this.recipeUrl : 'null') +
        ', assetName: ' + (this.assetName !== null ? this.assetName : 'null') +
        ', isFavorite: ' + (this.isFavorite !== null ? this.isFavorite : 'null') +
        ', notes: ' + (this.notes !== null ? this.notes : 'null') +
        ', recipeTags: ' + (this.recipeTags !== null ? this.recipeTags : 'null') +
        ']';
  }

  toJson(): Map<string, any> {
    let jsonMap: Map<string, any> = new Map<string, any>();
    RecipeUtil.addIfNotNull(jsonMap, "recipeName", this.recipeName);
    RecipeUtil.addIfNotNull(jsonMap, "notes", this.notes);
    RecipeUtil.addIfNotNull(jsonMap, "cookbook", this.cookbook !== null ? this.cookbook.toJson() : null);
    RecipeUtil.addIfNotNull(jsonMap, "pageNrs", this.pageNrs);
    RecipeUtil.addIfNotNull(jsonMap, "recipeUrl", this.recipeUrl);
    RecipeUtil.addIfNotNull(jsonMap, "assetName", this.assetName);
    RecipeUtil.addIfNotNull(jsonMap, "recipeTags", this.recipeTags !== null ? RecipeTag.toJsonArray(this.recipeTags) : null);

    RecipeUtil.addIntIfNotNull(jsonMap,  "id", this.id);
    RecipeUtil.addIntIfNotNull(jsonMap,  "version", this.version);
    RecipeUtil.addBoolIfNotNull(jsonMap, "isFavorite", this.isFavorite);

    return jsonMap;
  }

  static fromJson(jsonMap: Map<string, any>): Recipe {
    let temp: Recipe = new Recipe();
    if (jsonMap['id'] !== null)         temp.id      = jsonMap['id'];
    if (jsonMap['version'] !== null)    temp.version = jsonMap['version'];
    if (jsonMap['recipeName'] !== null) temp.recipeName = jsonMap['recipeName'];
    if (jsonMap['notes'] !== null)      temp.notes      = jsonMap['notes'];
    if (jsonMap['cookbook'] !== null)   temp.cookbook   = Cookbook.fromJson(jsonMap['cookbook']);
    if (jsonMap['pageNrs'] !== null)    temp.pageNrs    = jsonMap['pageNrs'];
    if (jsonMap['recipeUrl'] !== null)  temp.recipeUrl  = jsonMap['recipeUrl'];
    if (jsonMap['assetName'] !== null)  temp.assetName  = jsonMap['assetName'];
    if (jsonMap['isFavorite'] !== null) temp.isFavorite = jsonMap['isFavorite'];
    if (jsonMap['recipeTags'] !== null) temp.recipeTags = RecipeTag.fromList(jsonMap['recipeTags']);

    return temp;
  }

  static fromList(jsonArray: Array<Map<string, any>>): Array<Recipe> {
    let returnArray: Array<Recipe> = [];
    if (jsonArray instanceof Array) {
      jsonArray.forEach((map) => returnArray.push(Recipe.fromJson(map)));
    }

    return returnArray;
  }
}

export class RecipeTag extends DomainCommon {
  tagName: string;

  toString(): string {
    return 'RecipeTag[' +
        super.toString() +
        ', tagName: ' + this.tagName +
        ']';
  }

  toJson(): Map<string, any> {
    let jsonMap: Map<string, any> = new Map<string, any>();
    RecipeUtil.addIfNotNull(jsonMap, "tagName", this.tagName);
    RecipeUtil.addIntIfNotNull(jsonMap,  "id", this.id);
    RecipeUtil.addIntIfNotNull(jsonMap,  "version", this.version);

    return jsonMap;
  }

  static fromValues(tagname: string): RecipeTag {
    let temp: RecipeTag = new RecipeTag();
    temp.tagName = tagname;

    return temp;
  }

  static fromJson(jsonMap: Map<string, any>): RecipeTag {
    let temp: RecipeTag = new RecipeTag();
    if (jsonMap['id'] !== null)      temp.id      = jsonMap['id'];
    if (jsonMap['version'] !== null) temp.version = jsonMap['version'];
    if (jsonMap['tagName'] !== null) temp.tagName = jsonMap['tagName'];

    return temp;
  }

  static fromList(jsonArray: Array<Map<string, any>>): Array<RecipeTag> {
    let returnArray: Array<RecipeTag> = [];
    console.log('RecipeTag.fromList(jsonArray): %o', jsonArray);
    if (jsonArray instanceof Array) {
      for (let temp of jsonArray) {
        console.log('RecipeTag.fromList(temp): %o', temp);
        returnArray.push(RecipeTag.fromJson(temp));
      }
    }
    // if (jsonArray instanceof Array) {
    //   jsonArray.forEach((map) => returnArray.push(RecipeTag.fromJson(map)));
    // }

    return returnArray;
  }

  static toJsonArray(tags: Array<RecipeTag>): Array<Map<string, any>> {
    let list: Array<Map<string, any>> = [];

    if (tags !== null && tags.length !== 0) {
      tags.forEach((recipeTag) => list.push(recipeTag.toJson()));
    }

    return list;
  }
}

export class SearchCriteria {
  searchText: string = '';
  tags: Array<RecipeTag> = [];
  cookbookIds: Array<number> = [];

  // SearchCriteria({searchText: '', tags: const <RecipeTag>[], cookbookId: -1});

  isValid() : boolean {
    return ((this.searchText !== null && this.searchText.length !== 0) ||
      (this.tags !== null && this.tags.length !== 0) ||
      (this.cookbookIds !== null && this.cookbookIds.length !== 0));
  }

  toJson(): Map<string, any> {
    let jsonMap: Map<string, any> = new Map<string, any>();
    RecipeUtil.addIfNotNull(jsonMap, "searchText",  this.searchText);
    RecipeUtil.addIfNotNull(jsonMap, "tags", this.tags !== null ? RecipeTag.toJsonArray(this.tags) : null);
    RecipeUtil.addIfNotNull(jsonMap, "cookbookIds", this.cookbookIds);

    return jsonMap;
  }

  toString(): string {
    return 'SearchCriteria[' +
        'searchText: ' + this.searchText +
        ', tags: ' + this.tags +
        ', cookbookIds: ' + this.cookbookIds +
        ', isValid: ' + this.isValid() +
        ']';
  }
}
