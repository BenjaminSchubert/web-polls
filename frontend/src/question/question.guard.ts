import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { QuestionService } from "./question.service";
import { IQuestion } from "./stubs";


@Injectable()
export class QuestionGuard implements CanActivate, CanActivateChild {
    constructor(protected router: Router, private questions: QuestionService) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.questions.getForPoll(+route.params["poll"]).take(1).map((questions: IQuestion[]) =>
            questions.findIndex((q: IQuestion) => q.id === +route.params["question"]) !== -1,
        );
    }

    public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActivate(route, state);
    }
}
