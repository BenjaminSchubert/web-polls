import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { RoomService } from "./room.service";
import { IRoom } from "./stubs";


@Injectable()
export class RoomGuard implements CanActivate, CanActivateChild {
    constructor(protected router: Router, protected rooms: RoomService) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.rooms.get(+route.params["room"]).take(1).map((room: IRoom) => {
            if (room === undefined) {
                this.router.navigateByUrl("").then(() => console.log("OK")).catch(() => console.log("NO"));
            }
            return room !== undefined;
        });
    }

    public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActivate(route, state);
    }
}
