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
            }

    public create(room: INewRoom) {
        return super.create(room).do((res: Response) => {
            this.socket.emit("join", res.json().token);
        });
    }

    public join(data: {code: string}, callback?: (err: TError) => void) {
        this.socket.emit("join", data.code, (res: {[key: string]: number|string}) => {
            if (callback !== undefined) {
                callback(res);
            }
        });
    }

    public quit(room: IRoom) {
        return this.http.post(`${this.URL}${room.id}/quit/`, {}).do((res: Response) => this.remove(res.json().id));
    }
}
