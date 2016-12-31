import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { WebpollsComponent } from "./webpolls.component";
import { routing } from "./webpolls.routing";
import { UtilsModule } from "./utils/utils.module";
import { PollsModule } from "./polls/polls.module";
import { ExtendedRequestOptions } from "./utils/requests";
import { RequestOptions } from "@angular/http";
import { UserService } from "./auth/user.service";


@NgModule({
    bootstrap: [WebpollsComponent],
    declarations: [WebpollsComponent],
    imports: [
        BrowserModule, routing, UtilsModule,
        PollsModule,
    ],
    providers: [
        {provide: RequestOptions, useClass: ExtendedRequestOptions},
        UserService,
    ],
})
export class WebPollsModule {}
