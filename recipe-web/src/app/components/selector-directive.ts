// Copyright (c) 2017, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import {Injectable} from "@angular/core";
import {Recipe} from "../models/recipe_model";
import {Subscription} from "rxjs/Subscription";
import { timer } from "rxjs/observable/timer";

/// Keeps track of which recipe has been hovered over and clicked on, as only one
/// may be selected at a time across multiple lists. This will be treated as a
/// singleton as only the one instance is injected.
@Injectable()
export class SelectorDirective {

  timer: any = timer(1000, 1000);
  hoveredRecipe: Recipe = null;
  clickedRecipe: Recipe = null;
  lastFired: Recipe = null;
  subscription: Subscription;

  constructor() {}
}
