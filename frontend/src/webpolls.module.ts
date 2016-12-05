import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { WebpollsComponent } from "./webpolls.component";
import { routing } from "./webpolls.routing";
import { UtilsModule } from "./utils/utils.module";
import { PollsModule } from "./polls/polls.module";


@NgModule({
    bootstrap: [WebpollsComponent],
    declarations: [WebpollsComponent],
    imports: [
        BrowserModule, routing, UtilsModule,
        PollsModule,
    ],
    providers: [],
})
export class WebPollsModule {}
