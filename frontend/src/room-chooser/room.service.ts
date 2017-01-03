import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Room } from "../polls/stub";
import { AccountService } from "../auth/account.service";
import { Http, Response } from "@angular/http";
import { ROOMS_URL } from "../api.routes";
import * as io from "socket.io-client";


@Injectable()
export class RoomService {
    public $: Observable<Room[]>;

    private t: Room[];
    private _$: BehaviorSubject<Room[]>;

    // tslint:disable-next-line:no-any
    private socket: any;  // FIXME : we should type that

    constructor(private account: AccountService, private http: Http) {
        this._$ = new BehaviorSubject([]);
        this.$ = this._$.asObservable();

        this.socket = io("/rooms");

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

    public post(data: {name: string}) {
        return this.http.post(ROOMS_URL, data).map((res: Response) => {
            this.socket.emit("join", res.json().id);
            return res;
        });
    }

}
