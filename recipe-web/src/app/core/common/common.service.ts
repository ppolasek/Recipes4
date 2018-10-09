// Copyright (c) 2018, ppolasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import {throwError as observableThrowError,  Observable ,  of } from 'rxjs';

import { Recipes4AppConfig } from "@app/models";
import { WebLoggerService } from "../logger/logger.service";
import { Recipes4Logger } from "../logger/logger";

// -------------------- WebService methods -------------------- //

//
/// Base class for all WebServicess
///

@Injectable({
  providedIn: 'root'
})
export class WebService {

  private logger: Recipes4Logger = new Recipes4Logger(this.loggerService, 'WebService');

  readonly _options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(protected loggerService: WebLoggerService, private http: HttpClient, private config: Recipes4AppConfig) {}

  static isNumeric(s: string): boolean {
    if (s === null) {
      return false;
    }
    return !isNaN(parseInt(s, 10));
  }

  makeTheCall(method: string, payload: any): Observable<any> {
    // this.logger.fine(`makeTheCall() this.config.serverUrl = ${this.config.serverUrl}`);
    // this.logger.fine(`makeTheCall() this.config.contextPath = ${this.config.contextPath}`);
    // this.logger.fine(`makeTheCall() this.config.servletPath = ${this.config.servletPath}`);

    let theUrl = this.config.serverUrl + this.config.contextPath + this.config.servletPath + '/' + method;
    // this.logger.fine(`makeTheCall() theUrl = ${theUrl}`);

    if (payload !== null) {
      let newPayload = payload.toString();
      // this.logger.fine('makeTheCall() newPayload = ' + newPayload);
      // this.logger.fine('makeTheCall() this.isNumeric(newPayload) = ' + (WebService.isNumeric(newPayload) ? 'true' : 'false'));
      if (WebService.isNumeric(newPayload)) {
        payload = [payload];
        // this.logger.fine('makeTheCall() new payload = ' + payload.toString());
      }
    // } else {
    //   // JSON does not like null
    //   payload = {};
    }

    let encodedPayload: string = null;

    if (payload !== null) {
      encodedPayload = JSON.stringify(payload);
    }
    this.logger.finest(`makeTheCall() encodedPayload = ${encodedPayload}`);

    // Response response;
    // if (payload !== null) {
      return this.http.post<myresponse>(theUrl, encodedPayload, this._options)
        .pipe(
          tap(response => {
            this.logger.fine('makeTheCall() response: %o', response);
          }),
          map( response => {
            if (response !== null && response.result.ok === 'yes') {
              return of(response.return_obj[0]); // the response value comes back in an Array
            } else if (response !== null && response.result.ok === 'no') {
              return observableThrowError(response.err);
            } else {
              this.logger.severe('makeTheCall() bad response %o', response);
              return observableThrowError('makeTheCall() bad response. response = ' + response.toString());
            }
          }),
          catchError(this.handleError<any>(method))
        );
  }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed.
     * @param result - optional value to return as the observable result.
     */
  protected handleError<T>(operation = 'operation', result ? : T) {
    return (error: any): Observable<T> => {

      // console.log('handleError() error = ' + (error ? error.toString() : 'undefined')); // log to console instead
      // console.log(operation + ' failed: ' + (error ? error.message : ''));
      console.trace(operation + ' failed: ' + (error ? error.message : ''));

      this.logger.severe(operation + ' failed: ' + (error ? error.message : ''));

      // Let the app keep running by returning an empty result.
      return of(result as T);
    }
  }
}

class myresponse {
  // {result: {ok: "yes"},return_obj: null}
  result: myresult;
  return_obj: any;
  err: Error;

  toString(): string {
    return 'myresponse[' + this.result.toString() + ', err: ' + this.err.toString() + ', return_obj: ' + this.return_obj.toString() + ']';
  }
}

class myresult {
  ok: string;

  toString(): string {
    return '{ok: ' + this.ok + '}';
  }
}
