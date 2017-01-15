import { Subscription } from "rxjs/Subscription";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { PollService } from "./poll.service";
import { ActivatedRoute, Params } from "@angular/router";


@Component({
    selector: "wp-poll-list",
    templateUrl: "poll-list.html",
})
export class PollListComponent implements OnInit, OnDestroy {
    public room: number;

    private subscriptions: Subscription[] = [];

    constructor(private route: ActivatedRoute, public service: PollService) {}

    public ngOnInit(): void {
        this.subscriptions.push(this.route.params.subscribe((params: Params) => {
            this.room = parseInt(params["room"], 10);
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        this.subscriptions = [];
    }

}
