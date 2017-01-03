import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AccountService } from "../auth/account.service";
import { Http, Response } from "@angular/http";
import { ROOMS_URL } from "../api.routes";
import * as io from "socket.io-client";
import { TError } from "../base/base";
import { RestService } from "../base/rest.service";
import { IRoom, INewRoom } from "./stubs";


@Injectable()
export class RoomService extends RestService<INewRoom> {
    protected URL = ROOMS_URL;

    public $: Observable<IRoom[]>;

    private t: IRoom[];
    private _$: BehaviorSubject<IRoom[]>;

    // tslint:disable-next-line:no-any
    private socket: any;  // FIXME : we should type that

    constructor(http: Http, private account: AccountService) {
        super(http);
        this.t = [];
        this._$ = new BehaviorSubject(this.t);
        this.$ = this._$.asObservable();

        this.socket = io("/rooms");
        this.socket.connect();

        this.socket.on("list", (res: IRoom[]) => {
            this.t = res;
            this._$.next(this.t);
        });

        this.socket.on("item", (res: IRoom) => {
            let index = this.t.findIndex((room: IRoom) => room.id === res.id);

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

    public get(id: number) {
        return this.$.map((rooms: IRoom[]) => rooms.find((room: IRoom) => room.id === id));
    }

    public create(room: INewRoom) {
        return super.create(room).map((res: Response) => {
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
