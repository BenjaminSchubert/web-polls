import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Poll } from "../stub";


@Injectable()
export class PollService {
    public $: Observable<Poll[]>;
    public _$: BehaviorSubject<Poll[]>;

    constructor() {
        this._$ = new BehaviorSubject([]);
        this.$ = this._$.asObservable();
        this.fetch();
    }

    private fetch() {
        this._$.next([
            { active: true, owning: false, last_active: null, name: "Cours - 1", id: 1 },
            { active: false, owning: false, last_active: "DATE", name: "Examen - 1", id: 2 },
            { active: false, owning: false, last_active: "DATE", name: "Cours - 2", id: 3 },
            { active: true, owning: false, last_active: "DATE", name: "Cours - 3", id: 4 },
            { active: false, owning: true, last_active: "DATE", name: "Cours - 4", id: 5 },
            { active: false, owning: true, last_active: "DATE", name: "Examen - 2", id: 6 },
            { active: true, owning: false, last_active: "DATE", name: "Cours - 5", id: 7 },
            { active: false, owning: false, last_active: "DATE", name: "Examen - 3", id: 8 },
            { active: false, owning: false, last_active: "DATE", name: "Cours - 6", id: 9 },
            { active: false, owning: false, last_active: "DATE", name: "Révisions", id: 10 },
            { active: false, owning: false, last_active: "DATE", name: "Appréciations", id: 11 },
        ]);
    }

}
