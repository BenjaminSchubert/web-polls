import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";


@Injectable()
export class FullScreenService {
    public requested$: Observable<boolean>;
    private _requested$: BehaviorSubject<boolean>;

    constructor() {
        this._requested$ = new BehaviorSubject(false);
        this.requested$ = this._requested$.asObservable();
    }

    public close() {
        this._requested$.next(false);
    }

    public open() {
        this._requested$.next(true);
    }
}