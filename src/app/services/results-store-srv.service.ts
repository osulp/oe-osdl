import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

//let initialState: any = {};

@Injectable()
export class ResultsStoreSrvService {

  selectionChanged$: ReplaySubject<any> = new ReplaySubject<{}>(1);
  // _updates: Subject<any> = new Subject<any>();
  // _updateResults: Subject<any> = new Subject<any>();

  constructor() {

    //   this._updates
    //     .scan((accumulator: Object[], operation: Function) => {
    //       return operation(accumulator);
    //     }, initialState)
    //     .subscribe((data: any) => {
    //       this.selectionChanged$.next(data);
    //     });

    //   this._updateResults
    //     .map(() => {
    //       return (state: any) => {
    //         return state.map((result: any) => {
    //           console.log('got here?', result)
    //           return result;
    //         });
    //       };
    //     })
    //     .subscribe(this._updates);
  }

  updateResults(results): void {
    console.log('updating result store',results);
    this.selectionChanged$.next(results);
    //this._updateResults.next(results);
  }

}
