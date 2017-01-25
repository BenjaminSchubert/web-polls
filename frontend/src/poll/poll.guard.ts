import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { PollService } from "./poll.service";
import { IPoll } from "./stubs";


@Injectable()
export class PollGuard implements CanActivate, CanActivateChild {
    constructor(protected router: Router, protected polls: PollService) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.polls.getForRoom(+route.parent.params["room"]).take(1).map((polls: IPoll[]) =>
            polls.findIndex((poll: IPoll) => poll.id === +route.params["poll"]) !== -1,
        );
    }

    public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActivate(route, state);
    }
}
