// Copyright (c) 2018, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import {RecipeTag} from "../../models/recipe_model";

export class RecipeTagEvent {

  public type: string = '';
  public tag: RecipeTag = null;

  constructor() {}

  toString(): string {
    return 'RecipeTagEvent[' +
      'type = ' + this.type +
      ', tag = ' + (this.tag !== null ? this.tag.toString() : 'null') +
      ']';
  }
}
