import { Injectable } from "@angular/core";
import { RestService } from "../base/rest.service";
import { Http } from "@angular/http";
import { POLLS_URL } from "../api.routes";
import { IPoll, INewPoll } from "./stubs";
import { AccountService } from "../auth/account.service";


@Injectable()
export class PollService extends RestService<IPoll, INewPoll> {
    protected URL: string = POLLS_URL;

    constructor(http: Http, account: AccountService) {
        super(http, account, "/polls");
    }

    public getForRoom(id: number) {
        return this.$.map((polls: IPoll[]) => polls.filter((poll: IPoll) => poll.room_id === id));
    }

}
