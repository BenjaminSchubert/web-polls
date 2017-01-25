import { Injectable } from "@angular/core";
import { AccountService } from "../auth/account.service";
import { Http, Response } from "@angular/http";
import { ROOMS_URL } from "../api.routes";
import { RestService } from "../base/rest.service";
import { IRoom, INewRoom } from "./stubs";


@Injectable()
export class RoomService extends RestService<IRoom, INewRoom> {
    constructor(http: Http, account: AccountService) {
        super(ROOMS_URL, http, account, "/rooms");
    }

    public create(room: INewRoom) {
        return super.create(room).do((res: Response) => {
            this.socket.emit("join", res.json().token);
        });
    }

    public join(data: {code: string}) {
        return this.http.post(`${this.url}join/${data.code}`, {})
            .map((res: Response) => {
                this.socket.emit("join", data.code);
                return res;
            });
    }

    public quit(room: IRoom) {
        return this.http.post(`${this.url}${room.id}/quit/`, {}).do((res: Response) => this.remove(res.json().id));
    }
}
