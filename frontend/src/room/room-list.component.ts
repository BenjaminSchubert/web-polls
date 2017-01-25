import { Component } from "@angular/core";
import { RoomService } from "./room.service";
import { AccountService } from "../auth/account.service";
import { Router } from "@angular/router";


@Component({
    selector: "wp-room-list",
    templateUrl: "room-list.html",
})
export class RoomListComponent {
    constructor(public service: RoomService,
                public user: AccountService,
                private router: Router) {
    }

    public requestLogin() {
        this.user.requestLogin();
    }

    public addRoom() {
        this.router.navigate(["new"]).then();
    }
}
