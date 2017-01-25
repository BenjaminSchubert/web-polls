import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { WebpollsComponent } from "./webpolls.component";
import { routing } from "./webpolls.routing";
import { UtilsModule } from "./utils/utils.module";
import { ExtendedRequestOptions } from "./utils/requests";
import { RequestOptions } from "@angular/http";
import { AuthModule } from "./auth/auth.module";
import { PollModule } from "./poll/poll.module";
import { RoomModule } from "./room/room.module";
import { QuestionModule } from "./question/question.module";
import { FullScreenService } from "./fullscreen.service";


@NgModule({
    bootstrap: [WebpollsComponent],
    declarations: [WebpollsComponent],
    imports: [
        BrowserModule, routing,
        UtilsModule,
        AuthModule.forRoot(), PollModule.forRoot(), RoomModule.forRoot(), QuestionModule.forRoot(),
    ],
    providers: [
        {provide: RequestOptions, useClass: ExtendedRequestOptions}, FullScreenService,
    ],
})
export class WebPollsModule {
}
