import { Observable } from "rxjs";
import { Response, Http } from "@angular/http";


export abstract class RestService<T> {
    protected abstract URL: string;

    constructor(protected http: Http) {
    }

    public create(t: T): Observable<Response> {
        return this.http.post(this.URL, t);
    }

}
