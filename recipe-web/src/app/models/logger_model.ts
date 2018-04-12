// Copyright (c) 2018, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import { RecipeUtil } from "../util/recipe_util";

export class LogModel {

  logTime: Date;
  level: string;
  loggerName: string;
  message: string;

  toString(): string {
    return 'LogModel[ ' +
        'logTime: ' + this.logTime +
        ', level: ' + this.level +
        ', loggerName: ' + this.loggerName +
        ', message: ' + this.message +
        ' ]';
  }

  static fromValues(loggerName: string, logTime: Date, level: string, message: string): LogModel {
    let temp = new LogModel();
    temp.loggerName = loggerName;
    temp.logTime = logTime;
    temp.level = level;
    temp.message = message;

    return temp;
  }

  toJson(): Map<string, any> {
    let jsonMap = new Map<string, any>();
    RecipeUtil.addIfNotNull(jsonMap, "level",      this.level);
    RecipeUtil.addIfNotNull(jsonMap, "loggerName", this.loggerName);
    RecipeUtil.addIfNotNull(jsonMap, "message", this.message);

    RecipeUtil.addDateTimeIfNotNull(jsonMap, "logTime", this.logTime);

    return jsonMap;
  }
}
