import * as io from "socket.io-client";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Response, Http } from "@angular/http";
import { AccountService } from "../auth/account.service";
import { IIdentifiable } from "./stubs";


export abstract class RestService<T extends IIdentifiable, TNew> {
    protected abstract URL: string;

    public $: Observable<T[]>;
    public new$: Observable<T>;

    protected t: T[];
    protected _$: BehaviorSubject<T[]>;
    protected _new$: Subject<T>;

    // tslint:disable-next-line:no-any
    protected socket: any;  // FIXME : we should type that

    constructor(protected http: Http, protected account: AccountService, ioRoom: string) {
        this.t = [];
        this._$ = new BehaviorSubject(this.t);
        this._new$ = new Subject();
        this.$ = this._$.asObservable();
        this.new$ = this._new$.asObservable();

        this.socket = io(ioRoom);
        this.socket.connect();

        this.socket.on("disconnect", () => {
            this.t = [];
            this._$.next(this.t);
        });

        this.socket.on("list", (res: T[]) => {
            this.t = res;
            this._$.next(this.t);
        });

        this.socket.on("delete", (res: number) => {
            this.t.splice(this.t.findIndex((r: T) => r.id === res), 1);
            this._$.next(this.t);
        });

        this.socket.on("item", (res: T) => {
            let index = this.t.findIndex((room: T) => room.id === res.id);

            if (index >= 0) {
                this.t[index] = res;
            } else {
                this.t.push(res);
                this._new$.next(res);
            }
            this._$.next(this.t);
        });

        this.account.$.subscribe(() => {
            this.socket.disconnect();
            this.socket.connect();
        });
    }

    public create(t: TNew): Observable<Response> {
        return this.http.post(this.URL, t);
    }

    public delete(t: T): Observable<Response> {
        return this.http.delete(`${this.URL}${t.id}`);
    }

    public get(id: number) {
        return this.$.map((rooms: T[]) => rooms.find((r: T) => r.id === id));
    }
}
