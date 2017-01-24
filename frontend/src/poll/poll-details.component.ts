import { Observable } from "rxjs/Observable";
import { Component, OnInit } from "@angular/core";
import { ErrorHandler } from "../base/error_handler";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { IPoll } from "./stubs";
import { PollService } from "./poll.service";
import { RoomService } from "../room/room.service";
import { IRoom } from "../room/stubs";
import { QuestionService } from "../question/question.service";
import { IQuestion } from "../question/stubs";


@Component({
    templateUrl: "poll-details.html",
})
export class PollComponent extends ErrorHandler implements OnInit {
    public poll: IPoll;
    public room: IRoom;
    public editing: boolean = false;
    private questions$: Observable<IQuestion[]>;

    constructor(
        private route: ActivatedRoute,
        private service: PollService,
        private rooms: RoomService,
        public questions: QuestionService,
        private router: Router,
    ) {
        super();
        this.questions$ = this.route.params.switchMap((p: Params) => this.service.get(+p["poll"]))
            .switchMap((poll: IPoll) => {
                if (poll == null) {
                    return Observable.of([]);
                } else {
                    return this.questions.getForPoll(poll.id);
                }
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

    public delete() {
        this.service.delete(this.poll).subscribe(
            () => this.router.navigate([this.room.id]),
        );
    }

    public hasOpenQuestions() {
        return this.questions$.map((qs: IQuestion[]) => qs.length > 0 && qs.some((q: IQuestion) => q.is_open));
    }

    public hasClosedQuestions() {
        return this.questions$.map((qs: IQuestion[]) => qs.length > 0 && qs.some((q: IQuestion) => !q.is_open));
    }

    public setVisible(v: boolean) {
        let p = JSON.parse(JSON.stringify(this.poll));
        p.visible = v;
        this.service.update(p).subscribe();
    }

    public setOpen(opened: boolean) {
        this.service.open(this.poll, opened).subscribe();
    }

    public addQuestion() {
        this.router.navigate([this.room.id, this.poll.id, "new"]).then();
    }
}
