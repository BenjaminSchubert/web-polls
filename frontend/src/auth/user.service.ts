import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable, BehaviorSubject } from "rxjs";
import { Account } from "./stub";
import { AUTH_ACCOUNT_URL } from "../api.routes";


function noop() {}


@Injectable()
export class UserService {
    public $: Observable<Account>;
    public isLoggedIn$: Observable<boolean>;

    private _$: BehaviorSubject<Account>;

    constructor(private http: Http) {
        this._$ = new BehaviorSubject(null);
        this.$ = this._$.asObservable();
        this.isLoggedIn$ = this._$.map((a: Account) => a !== null);

        this.getAccount().subscribe(noop, noop);
    }

    private getAccount() {
        return this.http.get(AUTH_ACCOUNT_URL)
            .map((res: Response) => {
                this._$.next(res.json());
                return res;
            })
            .catch((err: Response) => {
                if (err.status === 401) {
                    this._$.next(null);
                }
                return Observable.throw(err);
            });
    }
}
