import { Subscription } from "rxjs/Subscription";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { PollService } from "./poll.service";
import { ActivatedRoute, Params } from "@angular/router";
import { RoomService } from "../room/room.service";
import { IRoom } from "../room/stubs";


@Component({
    selector: "wp-poll-list",
    templateUrl: "poll-list.html",
})
export class PollListComponent implements OnInit, OnDestroy {
    public room: IRoom;

    private subscriptions: Subscription[] = [];

    constructor(private route: ActivatedRoute, public service: PollService, private rooms: RoomService) {}

    public ngOnInit(): void {
        this.subscriptions.push(
            this.route.params
                .switchMap((params: Params) => this.rooms.get(+params["room"]))
                .subscribe((room: IRoom) => this.room = room),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        this.subscriptions = [];
    }

}
