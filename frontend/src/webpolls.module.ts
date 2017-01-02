import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { WebpollsComponent } from "./webpolls.component";
import { routing } from "./webpolls.routing";
import { UtilsModule } from "./utils/utils.module";
import { PollsModule } from "./polls/polls.module";
import { ExtendedRequestOptions } from "./utils/requests";
import { RequestOptions } from "@angular/http";
import { AccountService } from "./auth/account.service";
import { AuthModule } from "./auth/auth.module";


@NgModule({
    bootstrap: [WebpollsComponent],
    declarations: [WebpollsComponent],
    imports: [
        BrowserModule, routing, UtilsModule, AuthModule,
        PollsModule,
    ],
    providers: [
        {provide: RequestOptions, useClass: ExtendedRequestOptions},
        AccountService,
    ],
})
export class WebPollsModule {
}
