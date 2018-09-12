// Copyright (c) 2017, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Recipe} from "./models/recipe_model";

@Injectable()
export class RecipeAppEvent {

  recipeAdded   = new Subject<Recipe>();
  recipeUpdated = new Subject<Recipe>();
  recipeDeleted = new Subject<Recipe>();
  recipeHovered = new Subject<Recipe>();
  recipeClicked = new Subject<Recipe>();

  constructor() {}

}
