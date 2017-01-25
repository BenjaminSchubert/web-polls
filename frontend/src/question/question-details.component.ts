import { Component, OnInit } from "@angular/core";
import { ErrorHandler } from "../base/error_handler";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { IRoom } from "../room/stubs";
import { QuestionService } from "./question.service";
import { IQuestion, IChoice } from "./stubs";
import { IPoll } from "../poll/stubs";
import { PollService } from "../poll/poll.service";
import { RoomService } from "../room/room.service";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { FullScreenService } from "../fullscreen.service";


@Component({
    templateUrl: "question-details.html",
})
export class QuestionComponent extends ErrorHandler implements OnInit {
    public form: FormGroup = new FormGroup({});
    public poll: IPoll;
    public question: IQuestion;
    public room: IRoom;
    public currentQuestions: IQuestion[];
    public questionPoolSize = 0;
    public questionIndex = 0;
    public inPresentationMode: boolean = false;
    public hasOpen: boolean = false;

    public colors = ["#459b45", "#51b2de", "#a357dc", "#f36565", "#eaac39", "#fff177"];

    constructor(private route: ActivatedRoute,
                public questions: QuestionService,
                private polls: PollService,
                private rooms: RoomService,
                private router: Router,
                private builder: FormBuilder,
                private fullScreen: FullScreenService) {
        super();
    }

    public ngOnInit() {
        this.subscriptions.push(
            this.route.params.switchMap((p: Params) => this.questions.get(+p["question"]))
                .subscribe((question: IQuestion) => {
                    this.question = question;
                    this.buildForm();
                    this.checkDisable();
                }),
            this.route.params.switchMap((p: Params) => this.polls.get(+p["poll"]))
                .subscribe((poll: IPoll) => this.poll = poll),
            this.route.parent.parent.params.switchMap((p: Params) => this.rooms.get(+p["room"]))
                .subscribe((room: IRoom) => {
                    this.room = room;
                    this.checkDisable();
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
        let answer = [];
        if (this.question.type === "UNIQUE") {
            answer.push(this.form.value["answer"]);
        } else {
            for (let a of Object.keys(this.form.value)) {
                if (this.form.get(a).value) {
                    answer.push(a);
                }
            }
        }
        this.questions.vote(this.question, answer).subscribe();
    }

    public startPresentation() {
        this.fullScreen.open();
        this.inPresentationMode = true;
        this.setOpen(true);
    }

    public onKey(event: KeyboardEvent) {
        if (event.key === ".") {
            this.inPresentationMode = false;
            this.hasOpen = false;
            this.fullScreen.close();
        } else if (event.key === "Escape") {
            if (this.inPresentationMode) {
                this.inPresentationMode = false;
                this.hasOpen = false;
                this.fullScreen.close();
            } else {
                this.inPresentationMode = true;
                this.fullScreen.open();
            }
        } else if (event.key === "PageDown") {
            if (!this.hasOpen) {
                if (!this.question.is_open) {
                    this.setOpen(true);
                }
                this.hasOpen = true;
            } else if (this.hasOpen && this.question.is_open) {
                this.setOpen(false);
            } else if (this.hasOpen && !this.question.is_open) {
                if (this.questionIndex !== this.questionPoolSize - 1) {
                    this.next();
                    this.hasOpen = false;
                }
            }
        } else if (event.key === "PageUp") {
            if (!this.hasOpen) {
                if (this.questionIndex !== 0) {
                    this.previous();
                    this.hasOpen = true;
                }
            } else if (this.question.is_open) {
                this.setOpen(false);
                this.hasOpen = false;
            } else {
                this.setOpen(true);
            }
        }
    }

    private buildForm() {
        if (this.question == undefined) {
            return;
        }
        
        if (this.question.type === "UNIQUE") {
            let chosen = this.question.choices.filter((c: IChoice) => c.chosen == true);
            this.form = this.builder.group({
                "answer": [chosen.length === 1 ? chosen[0].id : null, Validators.required],
            });
        } else {
            this.form = this.builder.group({});
            for (let c of this.question.choices) {
                this.form.addControl("" + c.id, new FormControl(c.chosen));
            }
        }
    }

    private checkDisable(): void {
        if ((this.room !== undefined && this.room.owning) || (this.question !== undefined && !this.question.is_open)) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }
}
