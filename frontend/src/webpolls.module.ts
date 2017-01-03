import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { WebpollsComponent } from "./webpolls.component";
import { routing } from "./webpolls.routing";
import { UtilsModule } from "./utils/utils.module";
import { PollsModule } from "./polls/polls.module";
import { ExtendedRequestOptions } from "./utils/requests";
import { RequestOptions } from "@angular/http";
import { AuthModule } from "./auth/auth.module";
import { PollModule } from "./poll/poll.module";
import { RoomModule } from "./room/room.module";


@NgModule({
    bootstrap: [WebpollsComponent],
    declarations: [WebpollsComponent],
    imports: [
        BrowserModule, routing,
        UtilsModule,
        AuthModule.forRoot(), PollModule.forRoot(),
        PollsModule, RoomModule.forRoot(),
    ],
    providers: [
        {provide: RequestOptions, useClass: ExtendedRequestOptions},
    ],
})
export class WebPollsModule {}
