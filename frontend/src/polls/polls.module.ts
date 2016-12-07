import { NgModule } from "@angular/core";
import { RoomModule } from "./room/room.module";
import { PollsComponent } from "./polls.component";
import { pollsRouting } from "./polls.routing";
import { PollModule } from "./poll/poll.module";
import { QuestionModule } from "./question/question.module";


@NgModule({
    declarations: [PollsComponent],
    exports: [PollsComponent],
    imports: [RoomModule, PollModule, QuestionModule, pollsRouting],
})
export class PollsModule {}
