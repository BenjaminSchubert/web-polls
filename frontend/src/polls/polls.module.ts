import { NgModule } from "@angular/core";
import { RoomModule } from "./room/room.module";
import { PollsComponent } from "./polls.component";
import { pollsRouting } from "./polls.routing";
import { PollModule } from "./poll/poll.module";


@NgModule({
    declarations: [PollsComponent],
    exports: [PollsComponent],
    imports: [RoomModule, PollModule, pollsRouting],
})
export class PollsModule {}
