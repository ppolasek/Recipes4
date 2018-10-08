// Copyright (c) 2018, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";

import { LogModel, Recipes4AppConfig } from "@app/models";

/// LoggerService interface definition
///
export interface LoggerService {

//  LoggerService(Recipes4Logger logger, BrowserClient http, Recipes4AppConfig config) : super(logger, http, config);

  // Future<Null> log(String loggerName, DateTime logTime, String level, message, Object error, StackTrace stackTrace) => new Future(() => null);
  log(loggerName: string, logTime: Date, level: string, message: string, error: any, stackTrace: any);
}

export interface LoggerServiceConstructor {
  new (_http: HttpClient, _config: Recipes4AppConfig): LoggerService;
  clone(): LoggerService;
}

export var LoggerService : LoggerServiceConstructor;

/// LoggerService implementation
///
@Injectable({
  providedIn: 'root'
})
export class WebLoggerService implements LoggerService {
  readonly _options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  // constructor(private http: Http, private config: Recipes4AppConfig) {} // Inject Http client Service
  constructor(private http: HttpClient, private _config: Recipes4AppConfig) {} // Inject Http client Service

  log(loggerName: string, logTime: Date, level: string, message: string, error: Error, stackTrace: any) {
    let theUrl = this._config.serverUrl + this._config.contextPath + this._config.servletPath + '/logger';

    let temp = LogModel.fromValues(loggerName, logTime, level, message);

    // console.log(`WebLoggerService.log theUrl = ${theUrl}`);
    // console.log(`WebLoggerService.log temp = ${temp}`);
    // console.log('WebLoggerService.log temp.toJson():');
    // console.log(temp.toJson());
    // console.log(`WebLoggerService.log JSON.encode(temp) = ${JSON.stringify(temp)}`);

    this.http.post(theUrl, JSON.stringify(temp), this._options).subscribe(
    data => {
      if (data === null || data['result'] === null ||
        data['result']['ok'] === null || data['result']['ok'] !== 'yes') {
        //{result: {ok: "yes"},return_obj: null}
        // console.log('WebLoggerService.log data:');
        // console.log(data);
      }
      // console.log('WebLoggerService.log data:');
      // console.log(data);
      },
      (err: HttpErrorResponse) => {
        console.log(`WebLoggerService.log data: ${err}`);
        console.log(err);
      });
    // console.log('WebLoggerService.log after sending post request');
  }
}
