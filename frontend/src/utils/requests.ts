import { BaseRequestOptions } from "@angular/http";

export class ExtendedRequestOptions extends BaseRequestOptions {
    constructor() {
        super();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");
    }
}
