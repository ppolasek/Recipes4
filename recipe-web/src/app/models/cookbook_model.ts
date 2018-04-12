// Copyright (c) 2018, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import { DomainCommon} from "./model";
import { RecipeUtil } from "../util/recipe_util";

export class Cookbook extends DomainCommon {
  constructor(public name: string) {
    super();
  }

  toString(): string {
    return 'Cookbook[ ' +
        super.toString() +
        ', name: ' + this.name +
        ' ]';
  }

  toJson(): Map<string, any> {
    let jsonMap: Map<string, any> = new Map<string, any>();
    RecipeUtil.addIfNotNull(jsonMap, "name", name);

    RecipeUtil.addIntIfNotNull(jsonMap, "id", this.id);
    RecipeUtil.addIntIfNotNull(jsonMap, "version", this.version);
    return jsonMap;
  }

  static fromJson(jsonMap: Map<string, any>): Cookbook {
    // console.log('fromJson()')
    // console.log('fromJson() jsonMap: ' + (jsonMap ? 'true' : 'false'));
    // console.log('fromJson() jsonMap.toString(): ' + jsonMap.toString());
    // console.log('fromJson() id: ' + jsonMap['id']);
    // console.log('fromJson() version: ' + jsonMap['version']);
    // console.log('fromJson() name: ' + jsonMap['name']);

    if (jsonMap['name'] !== null) {
      let tempName: string = '';
      if (jsonMap['name']) tempName = jsonMap['name'];

      let temp = new Cookbook(tempName);

      if (jsonMap['id'] !== null)      temp.id = jsonMap['id'];
      if (jsonMap['version'] !== null) temp.version = jsonMap['version'];

      return temp;
    } else {
      return null;
    }
  }

  static fromList(jsonArray: Array<Map<string, any>>): Array<Cookbook> {
    // console.log(`fromList() jsonArray = ${jsonArray}`);
    // console.log('fromList() jsonArray: ' + (jsonArray ? 'true' : 'false'));
    // console.log('fromList() jsonArray instanceof Array: ' + (jsonArray instanceof Array ? 'true' : 'false'));
    // console.log('fromList() jsonArray.length > 0: ' + (jsonArray.length > 0 ? 'true' : 'false'));
    // console.log('fromList() jsonArray.length: ' + jsonArray.length);
    let returnArray: Array<Cookbook> = [];

    if (jsonArray instanceof Array) {
      jsonArray.forEach((map) => returnArray.push(Cookbook.fromJson(map)));
    }

    return returnArray;
  }
}
