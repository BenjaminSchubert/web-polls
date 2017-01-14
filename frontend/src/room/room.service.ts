import { Injectable } from "@angular/core";
import { AccountService } from "../auth/account.service";
import { Http, Response } from "@angular/http";
import { ROOMS_URL } from "../api.routes";
import { TError } from "../base/stubs";
import { RestService } from "../base/rest.service";
import { IRoom, INewRoom } from "./stubs";


@Injectable()
export class RoomService extends RestService<IRoom, INewRoom> {
    protected URL = ROOMS_URL;

    constructor(http: Http, account: AccountService) {
        super(http, account, "/rooms");

        this.socket.on("list", (res: IRoom[]) => {
            this.t = res;
            this._$.next(this.t);
        });

        this.socket.on("delete", (res: number) => {
            console.log(res, this.t, this.t.findIndex((r: IRoom) => r.id === res));
            this.t.splice(this.t.findIndex((r: IRoom) => r.id === res), 1);
            console.log(this.t);
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

    }

    public create(room: INewRoom) {
        return super.create(room).do((res: Response) => {
            this.socket.emit("join", res.json().token);
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

    public get(id: number) {
        return this.$.map((rooms: IRoom[]) => rooms.find((r: IRoom) => r.id === id));
    }
}
