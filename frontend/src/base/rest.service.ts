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

        this.socket.on("disconnect", () => this.replace([]));
        this.socket.on("list", (res: T[]) => this.replace(res));
        this.socket.on("delete", (res: number) => this.remove(res));
        this.socket.on("item", (res: T) => this.insert(res));

        this.account.$.subscribe(() => {
            this.socket.disconnect();
            this.socket.connect();
        });
    }

    public create(t: TNew): Observable<Response> {
        return this.http.post(this.URL, t);
    }

    public delete(t: T): Observable<Response> {
        return this.http.delete(`${this.URL}${t.id}/`);
    }

    public get(id: number) {
        return this.$.map((rooms: T[]) => rooms.find((r: T) => r.id === id));
    }

    public update(t: T): Observable<Response> {
        return this.http.put(`${this.URL}${t.id}/`, t);
    }

    protected insert(t: T): void {
        let index = this.t.findIndex((room: T) => room.id === t.id);

        if (index >= 0) {
            this.t[index] = t;
        } else {
            this.t.push(t);
            this._new$.next(t);
        }
        this._$.next(this.t);
    }

    protected replace(t: T[]): void {
        this.t = t;
        this._$.next(this.t);
    }

    protected remove(t: number): void {
        this.t.splice(this.t.findIndex((r: T) => r.id === t), 1);
        this._$.next(this.t);
    }
}
