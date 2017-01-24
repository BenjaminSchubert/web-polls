import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ErrorHandler } from "../base/error_handler";
import { noop } from "../base/miscellaneous";
import { Response } from "@angular/http";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { IRoom } from "../room/stubs";
import { QuestionService } from "./question.service";
import { IQuestion } from "./stubs";
import { IPoll } from "../poll/stubs";
import { PollService } from "../poll/poll.service";
import { RoomService } from "../room/room.service";


@Component({
    templateUrl: "question-details.html",
})
export class QuestionComponent extends ErrorHandler implements OnInit {
    public form: FormGroup;
    public poll: IPoll;
    public question: IQuestion;
    public room: IRoom;
    public question_pool_size = 0;
    public question_index = 0;
    public editing: boolean = false;

    constructor(
        private route: ActivatedRoute,
        public questions: QuestionService,
        private polls: PollService,
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
            this.route.params.switchMap((p: Params) => this.questions.get(+p["question"]))
                .subscribe((question: IQuestion) => this.question = question),
            this.route.params.switchMap((p: Params) => this.polls.get(+p["poll"]))
                .subscribe((poll: IPoll) => this.poll = poll),
            this.route.parent.parent.params.switchMap((p: Params) => this.rooms.get(+p["room"]))
                .subscribe((room: IRoom) => this.room = room),
            this.route.params.switchMap((p: Params) => this.questions.getForPoll(+p["poll"]))
                .combineLatest(this.route.params.switchMap((p: Params) => this.questions.get(+p["question"])))
                .subscribe((data: [IQuestion[], IQuestion]) => {
                    if (data[1] === undefined) {
                        return;
                    }
                    this.question_index = data[0].findIndex((q: IQuestion) => q.id === data[1].id);
                    this.question_pool_size = data[0].length;
                }),
        );
    }

    public submit() {
        this.questions.create(this.form.value).subscribe(
            noop,
            (err: Response) => this.handleError(err, this.form),
        );
    }

    public delete() {
        this.questions.delete(this.question).subscribe(
            () => this.router.navigate([this.poll.id]),
        );
    }

    public setVisible(v: boolean) {
        //let p = JSON.parse(JSON.stringify(this.poll));
        //p.visible = v;
        //this.questions.update(p).subscribe();
    }

}
