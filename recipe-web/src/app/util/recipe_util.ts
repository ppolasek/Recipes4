// Copyright (c) 2018, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import {RecipeTag} from "../models/recipe_model";

export class RecipeUtil {

  static sortRecipeTags(recipeTags: Array<RecipeTag>) {
    if (recipeTags !== null && recipeTags.length > 1) {
      recipeTags.sort((r1, r2) => {
        if (r1.tagName.toLowerCase() < r2.tagName.toLowerCase()) {
          return -1;
        } else if (r1.tagName.toLowerCase() > r2.tagName.toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }

  /// convert underscores '_' to spaces, then convert each word in the string to
  /// title case
  static toTitleCaseAll(text: string): string {
    if (text === null || text.length === 0) return text;

    // text.replaceAll('_', ' ');
    text.replace(new RegExp('_', 'g'),' ');

    let whole = '';
    text.split(' ').forEach((part) => {
      console.log('RecipeUtil.toTitleCaseAll() part = ' + part);
      whole += this.toTitleCase(part) + ' ';
    });

    return whole.trim();
  }

  static toTitleCase(text: string): string {
    if (text === null || text.length === 0) return text;
    if (text.length === 1) return text.toUpperCase();
    return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
  }

  static addBoolIfNotNull(jsonMap: Map<string, any>, key: string, value: boolean) {
    if (value !== null) {
      jsonMap.set(key, value);
    }
  }

  static addIfNotNull(jsonMap: Map<string, any>, key: string, value: any) {
    if (value !== null && value.isNotEmpty) {
      jsonMap.set(key, value);
    }
  }

  static addIntIfNotNull(jsonMap: Map<string, any>, key: string, value: number) {
    if (value !== null) {
      jsonMap.set(key, value);
    }
  }

  static addEnumIfNotNull(jsonMap: Map<string, any>, key: string, value: any) {
    if (value !== null) {
      jsonMap.set(key, value.toString());
    }
  }

  static addDateTimeIfNotNull(jsonMap: Map<string, any>, key: string, value: Date) {
    if (value !== null) {
      let temp = JSON.stringify(this._dateTimeEncoder(value));
      if (temp.substring(0, 1) === '"') {
        temp = temp.substring(1, temp.length - 1);
      }
      jsonMap.set(key, temp);
    }
  }

  static _dateTimeEncoder(item: Date): any {
    if (item !== null) {
      return item.toISOString();
    }
    return '';
  }
}
