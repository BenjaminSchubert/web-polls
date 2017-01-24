import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { IPoll } from "./stubs";
import { QuestionService } from "../question/question.service";
import { IQuestion } from "../question/stubs";
import { Observable } from "rxjs";


@Component({
    selector: "wp-poll-item",
    templateUrl: "poll-item.html",
})
export class PollItemComponent implements OnChanges {
    @Input() public poll: IPoll;
    @Input() public room: number;

    public isActive: Observable<boolean>;

    constructor(private questions: QuestionService) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.isActive = this.questions.getForPoll(this.poll.id).map((qs: IQuestion[]) => {
            if (this.poll.is_open) {
                return true;
            }
            return qs.some((q: IQuestion) => q.is_open);
        });
    }
}