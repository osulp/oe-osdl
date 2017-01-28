import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/Rx';

@Injectable()
export class ResultsStoreSrvService {

  selectionChanged$: ReplaySubject<any> = new ReplaySubject<{}>(1);

  constructor() { }

  updateResults(results): void {
    this.selectionChanged$.next(results);
  }

}
