import { Component, OnDestroy, OnInit } from "@angular/core";
import { PollService } from "./poll.service";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";


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
            this.room = params["room"];
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        this.subscriptions = [];
    }

}
