import { Component } from "@angular/core";
import { RoomService } from "./room.service";
import { UserService } from "../../auth/user.service";


@Component({
    selector: "wp-room-chooser",
    styleUrls: ["room-chooser.css"],
    templateUrl: "room-chooser.html",
})
export class RoomChooserComponent {
    constructor(public service: RoomService, public user: UserService) {}
}
