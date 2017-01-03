import { Component } from "@angular/core";
import { RoomService } from "./room.service";
import { AccountService } from "../auth/account.service";


@Component({
    selector: "wp-room-chooser",
    templateUrl: "room-chooser.html",
})
export class RoomChooserComponent {
    constructor(public service: RoomService, public user: AccountService) {}

    public requestLogin() {
        this.user.requestLogin();
    }
}
