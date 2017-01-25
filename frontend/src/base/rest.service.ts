import * as io from "socket.io-client";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Response, Http } from "@angular/http";
import { AccountService } from "../auth/account.service";
import { IIdentifiable } from "./stubs";


export abstract class RestService<T extends IIdentifiable, TNew> {
    public $: Observable<T[]>;
    public new$: Observable<T>;

    protected t: T[];
    protected _$: ReplaySubject<T[]>;
    protected _new$: Subject<T>;

    // tslint:disable-next-line:no-any
    protected socket: any;  // FIXME : we should type that

    constructor(protected url: string, protected http: Http, protected account: AccountService, ioRoom: string) {
        this.t = [];
        this._$ = new ReplaySubject(1);
        this._new$ = new Subject();
        this.$ = this._$.asObservable();
        this.new$ = this._new$.asObservable();

        this.socket = io(ioRoom);
        this.socket.connect();

        this.socket.on("connect", () => this.fetchAll().subscribe((ts: T[]) => this.replace(ts)));
        this.socket.on("disconnect", () => this.replace([]));
        this.socket.on("delete", (res: number) => this.remove(res));
        this.socket.on("item", (res: number) => this.fetch(res).subscribe((t: T) => this.insert(t)));

        this.account.$.subscribe(() => {
            this.socket.io.disconnect();
            this.socket.io.connect();
        });
    }

    public create(t: TNew): Observable<Response> {
        return this.http.post(this.url, t);
    }

    public delete(t: T): Observable<Response> {
        return this.http.delete(`${this.url}${t.id}/`);
    }

    public get(id: number) {
        return this.$.map((rooms: T[]) => rooms.find((r: T) => r.id === id));
    }

    public update(t: T): Observable<Response> {
        return this.http.put(`${this.url}${t.id}/`, t);
    }

    protected fetch(id: number): Observable<T> {
        return this.http.get(`${this.url}${id}/`).map((r: Response) => r.json());
    }

    protected fetchAll() {
        return this.http.get(this.url).map((r: Response) => r.json());
    }

    protected insert(t: T): void {
        let index = this.t.findIndex((_t: T) => t.id === _t.id);

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
