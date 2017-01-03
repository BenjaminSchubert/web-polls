import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable, BehaviorSubject } from "rxjs";
import { Account } from "./stub";
import { AUTH_ACCOUNT_URL, AUTH_LOGIN_URL, AUTH_REGISTER_URL, AUTH_LOGOUT_URL } from "../api.routes";
import { noop } from "../base/miscellaneous";
import { Router } from "@angular/router";


@Injectable()
export class AccountService {
    public $: Observable<Account>;
    public isLoggedIn$: Observable<boolean>;
    public loginIsRequested$: Observable<boolean>;

    public loginMessage: string = null;

    private _$: BehaviorSubject<Account>;
    private requestLogin$: BehaviorSubject<boolean>;

    private redirectUrl: string;

    constructor(private http: Http, private router: Router) {
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
                // tslint:disable-next-line:triple-equals
                if (this.redirectUrl != null) {
                    this.router.navigateByUrl(this.redirectUrl).then(); // FIXME : this does not work
                }
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

    public requestLogin(loginMessage?: string, route?: string) {
        // tslint:disable-next-line:triple-equals
        if (route != null) {
            this.redirectUrl = route;
        }
        this.loginMessage = loginMessage;
        this.requestLogin$.next(true);
    }

    public cancelLoginRequest() {
        this.redirectUrl = null;
        this.loginMessage = null;
        this.requestLogin$.next(false);
    }

    private getAccount() {
        return this.http.get(AUTH_ACCOUNT_URL)
            .map((res: Response) => {
                this._$.next(res.json());
                this.requestLogin$.next(false);
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
