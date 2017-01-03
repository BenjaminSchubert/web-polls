import { Component } from "@angular/core";
import { RoomService } from "./room.service";
import { AccountService } from "../auth/account.service";


@Component({
    selector: "wp-room-list",
    templateUrl: "room-list.html",
})
export class RoomListComponent {
    constructor(public service: RoomService, public user: AccountService) {}

    public requestLogin() {
        this.user.requestLogin();
    }
}
