import { Component } from "@angular/core";
import { RoomService } from "./room.service";


@Component({
    selector: "wp-room-chooser",
    styleUrls: ["room-chooser.css"],
    templateUrl: "room-chooser.html",
})
export class RoomChooserComponent {
    constructor(public service: RoomService) {}
}
