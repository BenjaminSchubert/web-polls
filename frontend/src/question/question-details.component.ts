import { Component, OnInit } from "@angular/core";
import { ErrorHandler } from "../base/error_handler";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { IRoom } from "../room/stubs";
import { QuestionService } from "./question.service";
import { IQuestion } from "./stubs";
import { IPoll } from "../poll/stubs";
import { PollService } from "../poll/poll.service";
import { RoomService } from "../room/room.service";
import { FormBuilder, FormGroup } from "@angular/forms";


@Component({
    templateUrl: "question-details.html",
})
export class QuestionComponent extends ErrorHandler implements OnInit {
    public form: FormGroup;
    public poll: IPoll;
    public question: IQuestion;
    public room: IRoom;
    public currentQuestions: IQuestion[];
    public questionPoolSize = 0;
    public questionIndex = 0;
    public editing: boolean = false;

    constructor(private route: ActivatedRoute,
                public questions: QuestionService,
                private polls: PollService,
                private rooms: RoomService,
                private router: Router,
                private builder: FormBuilder) {
        super();
    }

    public ngOnInit() {
        this.subscriptions.push(
            this.route.params.switchMap((p: Params) => this.questions.get(+p["question"]))
                .subscribe((question: IQuestion) => {
                    this.question = question;
                    this.buildForm();
                }),
            this.route.params.switchMap((p: Params) => this.polls.get(+p["poll"]))
                .subscribe((poll: IPoll) => this.poll = poll),
            this.route.parent.parent.params.switchMap((p: Params) => this.rooms.get(+p["room"]))
                .subscribe((room: IRoom) => {
                    this.room = room;
                    this.disableIfOwner();
                }),
            this.route.params.switchMap((p: Params) => this.questions.getForPoll(+p["poll"]))
                .combineLatest(this.route.params.switchMap((p: Params) => this.questions.get(+p["question"])))
                .subscribe((data: [IQuestion[], IQuestion]) => {
                    if (data[1] === undefined) {
                        return;
                    }
                    this.currentQuestions = data[0];
                    this.questionIndex = data[0].findIndex((q: IQuestion) => q.id === data[1].id);
                    this.questionPoolSize = data[0].length;
                }),
        );
    }

    public delete() {
        this.questions.delete(this.question).subscribe(
            () => this.router.navigate([this.room.id, this.poll.id]).then(),
        );
    }

    public setOpen(v: boolean) {
        let p = JSON.parse(JSON.stringify(this.question));
        p.is_open = v;
        this.questions.update(p).subscribe();
    }

    public next() {
        this.router.navigate([this.room.id, this.poll.id, this.currentQuestions[this.questionIndex + 1].id]).then();
    }

    public previous() {
        this.router.navigate([this.room.id, this.poll.id, this.currentQuestions[this.questionIndex - 1].id]).then();
    }

    public submit() {
        console.log(this.form.value);
    }

    private buildForm() {
        this.form = this.builder.group({
            "answer": [null],
        });
    }

    private disableIfOwner() {
        if (this.room !== undefined && this.room.owning) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }
}
