import {OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";


export class BaseComponent implements OnDestroy {
    protected subscriptions: Subscription[];

    constructor() {
        this.subscriptions = [];
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        this.subscriptions = [];
    }
}