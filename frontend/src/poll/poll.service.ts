import { Injectable } from "@angular/core";
import { RestService } from "../base/rest.service";
import { Http } from "@angular/http";
import { POLLS_URL } from "../api.routes";
import { IPoll, INewPoll } from "./stubs";
import { AccountService } from "../auth/account.service";
import { RoomService } from "../room/room.service";
import { IRoom } from "../room/stubs";


@Injectable()
export class PollService extends RestService<IPoll, INewPoll> {
    protected URL: string = POLLS_URL;

    constructor(http: Http, account: AccountService, rooms: RoomService) {
        super(http, account, "/polls");
        rooms.new$.subscribe((room: IRoom) => this.socket.emit("join", room.id));
    }

    public getForRoom(id: number) {
        return this.$.map((polls: IPoll[]) => polls.filter((poll: IPoll) => poll.room_id === id));
    }

    public open(poll: IPoll, open: boolean) {
        return this.http.post(`${this.URL}/${poll.id}/open/`, { open: open });
    }

}
