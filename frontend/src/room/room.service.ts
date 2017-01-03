import { Injectable } from "@angular/core";
import { AccountService } from "../auth/account.service";
import { Http, Response } from "@angular/http";
import { ROOMS_URL } from "../api.routes";
import * as io from "socket.io-client";
import { TError } from "../base/stubs";
import { RestService } from "../base/rest.service";
import { IRoom, INewRoom } from "./stubs";


@Injectable()
export class RoomService extends RestService<IRoom, INewRoom> {
    protected URL = ROOMS_URL;

    // tslint:disable-next-line:no-any
    private socket: any;  // FIXME : we should type that

    constructor(http: Http, private account: AccountService) {
        super(http);

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
