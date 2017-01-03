import { Component, Input } from "@angular/core";
import { Room } from "../polls/stub";


@Component({
    selector: "wp-room",
    templateUrl: "room.html",
})
export class RoomComponent {
    @Input() public room: Room;
}
