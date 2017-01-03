import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Room } from "../polls/stub";
import { AccountService } from "../auth/account.service";
import { Http, Response } from "@angular/http";
import { ROOMS_URL } from "../api.routes";
import * as io from "socket.io-client";
import { TError } from "../base/base";


@Injectable()
export class RoomService {
    public $: Observable<Room[]>;

    private t: Room[];
    private _$: BehaviorSubject<Room[]>;

    // tslint:disable-next-line:no-any
    private socket: any;  // FIXME : we should type that

    constructor(private account: AccountService, private http: Http) {
        this.t = [];
        this._$ = new BehaviorSubject(this.t);
        this.$ = this._$.asObservable();

        this.socket = io("/rooms");
        this.socket.connect();

        this.socket.on("list", (res: Room[]) => {
            this.t = res;
            this._$.next(this.t);
        });

        this.socket.on("item", (res: Room) => {
            let index = this.t.findIndex((room: Room) => room.id === res.id);

            if (index >= 0) {
                this.t[index] = res;
            } else {
                this.t.push(res);
            }
            this._$.next(this.t);
        });

        this.socket.on("disconnect", () => {
            this.t = [];
            this._$.next(this.t);
        });

        this.account.$.subscribe(() => {
            this.socket.connect();
        });
    }

    public create(data: {name: string}) {
        return this.http.post(ROOMS_URL, data).map((res: Response) => {
            this.socket.emit("join", res.json().id);
            return res;
        });
    }

    public join(data: {code: string}, callback?: (err: TError) => void) {
        this.socket.emit("join", data.code, (res: {[key: string]: number|string}) => {
            if (callback !== undefined) {
                callback(res);
            }
        });
    }

}
