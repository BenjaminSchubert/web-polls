import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Room } from "../stub";


@Injectable()
export class RoomService {
    public $: Observable<Room[]>;
    public _$: BehaviorSubject<Room[]>;

    constructor() {
        this._$ = new BehaviorSubject([]);
        this.$ = this._$.asObservable();
        this.fetch();
    }

    private fetch() {
        this._$.next([
            { active: true, archived: false, owning: false, last_active: null, name: "TWEB-2016", id: 1 },
            { active: false, archived: false, owning: false, last_active: "DATE", name: "AMT-2016", id: 2 },
            { active: false, archived: true, owning: false, last_active: "DATE", name: "RES-2016", id: 3 },
            { active: true, archived: false, owning: false, last_active: "DATE", name: "ANDLR", id: 4 },
            { active: false, archived: false, owning: true, last_active: "DATE", name: "JDR", id: 5 },
            { active: false, archived: false, owning: true, last_active: "DATE", name: "Magic", id: 6 },
            { active: true, archived: false, owning: false, last_active: "DATE", name: "SYM-2016", id: 7 },
            { active: false, archived: false, owning: false, last_active: "DATE", name: "PRR-2016", id: 8 },
            { active: false, archived: false, owning: false, last_active: "DATE", name: "MAC-2016", id: 9 },
            { active: false, archived: false, owning: false, last_active: "DATE", name: "IHM-2016", id: 10 },
            { active: false, archived: false, owning: false, last_active: "DATE", name: "GET-2016", id: 11 },
        ]);
    }

}
