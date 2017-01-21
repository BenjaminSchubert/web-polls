import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ErrorHandler } from "../base/error_handler";
import { noop } from "../base/miscellaneous";
import { Response } from "@angular/http";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { IPoll } from "./stubs";
import { PollService } from "./poll.service";
import { RoomService } from "../room/room.service";
import { IRoom } from "../room/stubs";
import { QuestionService } from "../question/question.service";


@Component({
    templateUrl: "poll-details.html",
})
export class PollComponent extends ErrorHandler implements OnInit {
    public form: FormGroup;
    public poll: IPoll;
    public room: IRoom;
    public editing: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private service: PollService,
        private rooms: RoomService,
        public questions: QuestionService,
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
            this.route.params.switchMap((p: Params) => this.service.get(+p["poll"]))
                .subscribe((poll: IPoll) => this.poll = poll),
            this.route.parent.parent.params.switchMap((p: Params) => this.rooms.get(+p["room"]))
                .subscribe((room: IRoom) => this.room = room),
        );
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

    public makeVisible() {
        // FIXME IMPLEMENT
    }

    public addQuestion() {
        this.router.navigate([this.room.id, this.poll.id, "new"]).then();
    }
}
