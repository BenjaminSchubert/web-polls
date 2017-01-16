import { Subscription } from "rxjs/Subscription";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ErrorHandler } from "../base/error_handler";
import { noop } from "../base/miscellaneous";
import { Response } from "@angular/http";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { IPoll } from "./stubs";
import { PollService } from "./poll.service";
import { RoomService } from "../room/room.service";
import { IRoom } from "../room/stubs";


@Component({
    templateUrl: "poll-details.html",
})
export class PollComponent extends ErrorHandler implements OnInit, OnDestroy {
    public form: FormGroup;
    public poll: IPoll;
    public room: IRoom;
    public editing: boolean = false;

    public subscriptions: Subscription[];

    constructor(
        private route: ActivatedRoute,
        private service: PollService,
        private rooms: RoomService,
        private builder: FormBuilder,
        private router: Router,
    ) {
        super();
        this.subscriptions = [];

        this.form = this.builder.group({
            name: ["", Validators.required],
        });
    }

    public ngOnInit() {
        this.subscriptions.push(
            this.route.params
                .switchMap((params: Params) => this.service.get(+params["poll"]))
                .subscribe((poll: IPoll) => this.poll = poll),
            this.route.parent.params
                .switchMap((params: Params) => this.rooms.get(+params["room"]))
                .subscribe((room: IRoom) => this.room = room),
        );
    }

    public ngOnDestroy() {
        this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        this.subscriptions = [];
    }

    public submit() {
        this.service.create(this.form.value).subscribe(
            noop,
            (err: Response) => this.handleError(err, this.form),
        );
    }

    public delete() {
        this.service.delete(this.poll).subscribe(
            () => this.router.navigate([this.room.id]),
        );
    }
}