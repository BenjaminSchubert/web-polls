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

        this.socket.on("list", (res: IPoll) => {
            console.log("GOT " + res);
        });
    }

}
