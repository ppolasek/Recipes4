// Copyright (c) 2018, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import { WebLoggerService } from "@app/core";

export const Level = {
  FINE    : 'FINE',
  FINER   : 'FINER',
  FINEST  : 'FINEST',
  INFO    : 'INFO',
  WARNING : 'WARNING',
  SEVERE  : 'SEVERE'
};

export class Recipes4Logger {

  constructor(private loggerService: WebLoggerService, private loggerName) {
    this.log(Level.FINE, `Recipes4Logger() constructor. loggerName = ${loggerName}`);
  }

  log(level: string, message, error?: any, stackTrace?: any): void {
    // nicely format this to the console without the initial text
    console.log('%s %s %s', Recipes4Logger.toLength(this.loggerName, 25), Recipes4Logger.toLength(level, 8), message);
    this.loggerService.log(this.loggerName, new Date(), level.toString(), message, error, stackTrace);
  }

  private static toLength(value: string, len: number): string {
    if (value === 'undefined' || value === null) return '';
    return value.concat(' '.repeat(len)).substring(0, len);
  }

  fine(message, error?: any, stackTrace?: any) {
    this.log(Level.FINE, message, error, stackTrace);
  }

  finer(message, error?: any, stackTrace?: any) {
    this.log(Level.FINER, message, error, stackTrace);
  }

  finest(message, error?: any, stackTrace?: any) {
    this.log(Level.FINEST, message, error, stackTrace);
  }

  info(message, error?: any, stackTrace?: any) {
    this.log(Level.INFO, message, error, stackTrace);
  }

  warning(message, error?: any, stackTrace?: any) {
    this.log(Level.WARNING, message, error, stackTrace);
  }

  severe(message, error?: any, stackTrace?: any) {
    this.log(Level.SEVERE, message, error, stackTrace);
  }

  toString(): string {
    return `Recipes4Logger(${this.loggerName})`;
  }
}
