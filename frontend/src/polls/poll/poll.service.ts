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
            { active: true, owning: false, last_active: null, name: "Lesson - 1", id: 1 },
            { active: false, owning: false, last_active: "DATE", name: "Exam - 1", id: 2 },
            { active: false, owning: false, last_active: "DATE", name: "Lesson - 2", id: 3 },
            { active: true, owning: false, last_active: "DATE", name: "Lesson - 3", id: 4 },
            { active: false, owning: true, last_active: "DATE", name: "Lesson - 4", id: 5 },
            { active: false, owning: true, last_active: "DATE", name: "Exam - 2", id: 6 },
            { active: true, owning: false, last_active: "DATE", name: "Lesson - 5", id: 7 },
            { active: false, owning: false, last_active: "DATE", name: "Exam - 3", id: 8 },
            { active: false, owning: false, last_active: "DATE", name: "Lesson - 6", id: 9 },
            { active: false, owning: false, last_active: "DATE", name: "Final exam", id: 10 },
            { active: false, owning: false, last_active: "DATE", name: "Evaluations", id: 11 },
        ]);
    }

}
