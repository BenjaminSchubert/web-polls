import { Component, Input } from "@angular/core";
import { IRoom } from "./stubs";


@Component({
    selector: "wp-room-item",
    templateUrl: "room-item.html",
})
export class RoomItemComponent {
    @Input() public room: IRoom;
}
