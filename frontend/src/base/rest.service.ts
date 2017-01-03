import { Observable, BehaviorSubject } from "rxjs";
import { Response, Http } from "@angular/http";


export abstract class RestService<T, TNew> {
    protected abstract URL: string;

    public $: Observable<T[]>;

    protected t: T[];
    protected _$: BehaviorSubject<T[]>;

    constructor(protected http: Http) {
        this.t = [];
        this._$ = new BehaviorSubject(this.t);
        this.$ = this._$.asObservable();
    }

    public create(t: TNew): Observable<Response> {
        return this.http.post(this.URL, t);
    }

}
