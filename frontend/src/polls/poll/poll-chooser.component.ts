import { Component, OnDestroy, OnInit } from "@angular/core";
import { PollService } from "./poll.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";


@Component({
    selector: "wp-poll-chooser",
    styleUrls: ["poll-chooser.css"],
    templateUrl: "poll-chooser.html",
})
export class PollChooserComponent implements OnInit, OnDestroy {
    public room: number;

    private subscriptions: Subscription[] = [];

    constructor(private route: ActivatedRoute, public service: PollService) {}

    public ngOnInit(): void {
        this.subscriptions.push(this.route.queryParams.subscribe((params) => this.room = params["room"]));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        this.subscriptions = [];
    }

}
