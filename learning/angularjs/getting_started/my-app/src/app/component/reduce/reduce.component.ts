import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/from";
import {tap, reduce, flatMap} from "rxjs/operators";

@Component({
  selector: 'app-reduce',
  templateUrl: './reduce.component.html',
  styleUrls: ['./reduce.component.css']
})
export class ReduceComponent implements OnInit {

  constructor() { }

  tags: Array<string> = ['one', 'two', 'three', 'four'];

  ngOnInit() {
    console.log('ngOnInit()');
//    let finalArray: Array<string> = [];

    let source = Observable.from(this.tags)
      .pipe(
        tap((data) => console.log('ngOnInit() do(data) = ' + data)),
//        flatMap((data) => this.saveTag(data)),
        reduce(function (finalArray: Array<string>, data: string, idx: number) {
          console.log('ngOnInit() finalArray = ' + finalArray.toString() + ', reduce data = ' + data);
          finalArray.push(data);
          return finalArray;
        }, [])
      );

    let subscription = source.subscribe(
      function (x) { console.log('ngOnInit() subscription x = ' + x) },
      function (err) { console.error('ngOnInit() error err = ' + err) },
      function () { console.log('ngOnInit() completed') }
    );
  }

  saveTag(newtag: Observable<string>): Observable<string> {
    return newtag;
  }

}
