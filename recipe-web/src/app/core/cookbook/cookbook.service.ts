// Copyright (c) 2018, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";

import {Cookbook, Recipes4AppConfig} from "@app/models";
import { Recipes4Logger, WebService, WebLoggerService} from "@app/core";

/// CookbookService interface definition
///
export interface CookbookService {

  getAllCookbooks(): Observable<Array<Cookbook>>;

  // Future<Cookbook> getCookbookById(int cookbookId) => new Future(() => null);
  // Future<Cookbook> saveCookbook(Cookbook cookbookId) => new Future(() => null);
  // Future<Cookbook> createCookbook(Cookbook cookbookId) => new Future(() => null);
  // Future<bool> deleteCookbook(int cookbookId) => new Future(() => null);
}

/// CookbookService implementation
///

@Injectable({
  providedIn: 'root'
})
export class WebCookbookService extends WebService implements CookbookService {
  private mylog: Recipes4Logger = new Recipes4Logger(this.loggerService, 'WebCookbookService');

  constructor(protected loggerService: WebLoggerService, http: HttpClient, config: Recipes4AppConfig) {
    super(loggerService, http, config);
    // super(this.log, this.http, this.config);
  }

  getAllCookbooks(): Observable<Array<Cookbook>> {
    return this.makeTheCall('getAllCookbooks', null)
      .pipe(
        tap(response => {
          this.mylog.fine(`getAllCookbooks() response = ${response.value}`);
        }),
        map(response => {
          let returnList: Array<Cookbook> = Cookbook.fromList(response.value);
          this.mylog.fine(`getAllCookbooks() returnList = ${returnList}`);
          return returnList;
        }),
        catchError(this.handleError<Array<Cookbook>>('getAllCookbooks()'))
      );
  }

  // @override
  // Future<Cookbook> getCookbookById(int cookbookId) => new Future(() => null);
  //
  // @override
  // Future<Cookbook> saveCookbook(Cookbook cookbookId) => new Future(() => null);
  //
  // @override
  // Future<Cookbook> createCookbook(Cookbook cookbookId) => new Future(() => null);
  //
  // @override
  // Future<bool> deleteCookbook(int cookbookId) => new Future(() => true);
}
