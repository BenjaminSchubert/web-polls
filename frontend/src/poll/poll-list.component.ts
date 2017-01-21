import { Component, OnInit } from "@angular/core";
import { PollService } from "./poll.service";
import { ActivatedRoute, Params } from "@angular/router";
import { RoomService } from "../room/room.service";
import { IRoom } from "../room/stubs";
import { BaseComponent } from "../base/base.component";


@Component({
    selector: "wp-poll-list",
    templateUrl: "poll-list.html",
})
export class PollListComponent extends BaseComponent implements OnInit {
    public room: IRoom;

    constructor(private route: ActivatedRoute, public service: PollService, private rooms: RoomService) {
        super();
    }

    public ngOnInit(): void {
        this.subscriptions.push(
            this.route.params
                .switchMap((params: Params) => this.rooms.get(+params["room"]))
                .subscribe((room: IRoom) => this.room = room),
        );
    }
}
