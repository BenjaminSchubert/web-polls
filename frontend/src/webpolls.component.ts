import { Component, ViewEncapsulation } from "@angular/core";
import { AccountService } from "./auth/account.service";


/**
 * Main component for the application
 */
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: "wp-app",
    styleUrls: ["webpolls.css"],
    templateUrl: "webpolls.html",
})
export class WebpollsComponent {
    constructor(public account: AccountService) {
    }

    public login() {
        this.account.requestLogin();
    }

    public logout() {
        this.account.logout().subscribe();
    }
}
