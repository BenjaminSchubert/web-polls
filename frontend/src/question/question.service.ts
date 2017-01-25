import { Injectable } from "@angular/core";
import { RestService } from "../base/rest.service";
import { Http } from "@angular/http";
import { QUESTIONS_URL } from "../api.routes";
import { INewQuestion, IQuestion } from "./stubs";
import { AccountService } from "../auth/account.service";
import { IPoll } from "../poll/stubs";
import { PollService } from "../poll/poll.service";


@Injectable()
export class QuestionService extends RestService<IQuestion, INewQuestion> {
    constructor(http: Http, account: AccountService, polls: PollService) {
        super(QUESTIONS_URL, http, account, "/questions");
        polls.new$.subscribe((poll: IPoll) => this.socket.emit("join", poll.id));
    }

    public getForPoll(id: number) {
        return this.$.map((questions: IQuestion[]) =>
            questions.filter((question: IQuestion) => question.poll_id === id));
    }

    public vote(question: IQuestion, vote: number[]) {
        return this.http.post(`${this.url}${question.id}/answer/`, vote);
    }
}
