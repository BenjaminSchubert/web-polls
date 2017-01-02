import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable, BehaviorSubject } from "rxjs";
import { Account } from "./stub";
import { AUTH_ACCOUNT_URL, AUTH_LOGIN_URL, AUTH_REGISTER_URL, AUTH_LOGOUT_URL } from "../api.routes";
import { noop } from "../base/miscellaneous";


@Injectable()
export class AccountService {
    public $: Observable<Account>;
    public isLoggedIn$: Observable<boolean>;
    public loginIsRequested$: Observable<boolean>;

    private _$: BehaviorSubject<Account>;
    private requestLogin$: BehaviorSubject<boolean>;

    constructor(private http: Http) {
        this._$ = new BehaviorSubject(null);
        this.$ = this._$.asObservable();
        this.isLoggedIn$ = this._$.map((a: Account) => a !== null);

        this.requestLogin$ = new BehaviorSubject(false);
        this.loginIsRequested$ = this.requestLogin$.asObservable();

        this.getAccount().subscribe(noop, noop);
    }

    public login(data: {username: string, password: string}, url = AUTH_LOGIN_URL) {
        return this.http.post(url, data)
            .map((res: Response) => {
                this.getAccount().subscribe(noop, noop);
                this.requestLogin$.next(false);
                return res;
            });
    }

    public logout() {
        return this.http.post(AUTH_LOGOUT_URL, {})
            .map((res: Response) => {
                this._$.next(null);
                return res;
            });
    }

    public register(data: {username: string, password: string, repeat_password: string}) {
        return this.login(data, AUTH_REGISTER_URL);
    }

    public requestLogin() {
        this.requestLogin$.next(true);
    }

    public cancelLoginRequest() {
        this.requestLogin$.next(false);
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
