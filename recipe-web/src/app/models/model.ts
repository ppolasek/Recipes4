// Copyright (c) 2018, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

// import 'package:angular/angular.dart';
// import 'package:recipe_web/src/logger/logger.dart';

import { RecipeUtil } from "../util/recipe_util";

export class Recipes4AppConfig {
  public serverUrl: string;
  public contextPath: string;
  public servletPath: string;

  constructor(serverUrl, contextPath, servletPath) {
    this.serverUrl = serverUrl;
    this.contextPath = contextPath;
    this.servletPath = servletPath;
  }
}

export enum RecipeAction {
  cancel,
  discard,
  disagree,
  agree,
  yes,
  no,
  reload,
}

export enum HistoryRetention {
  none,
  sixMonths,
  oneYear,
  neverDelete
}

export abstract class DomainCommon {
  public id: number = -1;
  public version: number = 0;

  isNew(): boolean {
    return this.id === null || this.id < 0;
  }

  toString(): String {
    return 'id: ' + this.id + ', version: ' + this.version + ', isNew: ' + this.isNew();
  }
}

export class RecipeConfiguration {
//  static Recipes4Logger _log = new Recipes4Logger('RecipeConfiguration');

  public showDivider: boolean = true;
  public showDenseLayout: boolean = true;
//  MaterialListType materialListType = MaterialListType.threeLine;
  public retention: HistoryRetention = HistoryRetention.neverDelete;

  toString(): String {
    return 'RecipeConfiguration[' +
        'showDivider: ' + this.showDivider +
        ', showDenseLayout: ' + this.showDenseLayout +
//        ', materialListType: ' + this.materialListType +
        ', retention: ' + this.retention +
        ']';
  }

  toJson(): Map<string, any> {
    let jsonMap: Map<string, any> = new Map<string, any>();
    RecipeUtil.addBoolIfNotNull(jsonMap, "showDivider",      this.showDivider);
    RecipeUtil.addBoolIfNotNull(jsonMap, "showDenseLayout",  this.showDenseLayout);
//    RecipeUtil.addEnumIfNotNull(jsonMap, "materialListType", this.materialListType);
    RecipeUtil.addEnumIfNotNull(jsonMap, "retention",        this.retention);
    return jsonMap;
  }

  static fromJson(jsonMap: Map<string, any>) {
    let temp = new RecipeConfiguration();
    if (jsonMap['showDivider']      !== null) temp.showDivider      = jsonMap['showDivider'];
    if (jsonMap['showDenseLayout']  !== null) temp.showDenseLayout  = jsonMap['showDenseLayout'];
//    if (jsonMap['materialListType'] !== null) temp.materialListType = materialListTypeFromString(jsonMap['materialListType']);
//     if (jsonMap['retention']        !== null) temp.retention        = historyRetentionFromString(jsonMap['retention']);
  }
// this was an enum in the flutter language
//  static MaterialListType materialListTypeFromString(String jsonValue) {
////    _log.fine('materialListTypeFromString($jsonValue)');
////    _log.fine('materialListTypeFromString() MaterialListType.values = ${MaterialListType.values}');
//    return MaterialListType.values.firstWhere((mlt) =>
//        mlt.toString() === jsonValue
//    , orElse: () {
//      _log.fine('materialListTypeFromString() no MaterialListType match found for '
//          'value \'$jsonValue\', returning ${MaterialListType.threeLine}.');
//      return MaterialListType.threeLine;
//    });
//  }

//   static HistoryRetention historyRetentionFromString(String jsonValue) {
// //    _log.fine('historyRetentionFromString($jsonValue)');
// //    _log.fine('historyRetentionFromString() MaterialListType.values = ${MaterialListType.values}');
//     return HistoryRetention.values.firstWhere((hr) =>
//         hr.toString() === jsonValue
//     , orElse: () {
// //      _log.fine('historyRetentionFromString() no HistoryRetention match found for '
// //          'value \'$jsonValue\', returning ${HistoryRetention.neverDelete}.');
//       return HistoryRetention.neverDelete;
//     });
//   }
}
