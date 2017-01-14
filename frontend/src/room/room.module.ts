import { NgModule, ModuleWithProviders } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { RoomCreationComponent } from "./room-creation.component";
import { RoomIndexComponent } from "./room-index.component";
import { RoomComponent } from "./room-details.component";
import { RoomService } from "./room.service";
import { RoomItemComponent } from "./room-item.component";
import { RoomListComponent } from "./room-list.component";
import { RoomContainerComponent } from "./room-container.component";
import { PollModule } from "../poll/poll.module";


@NgModule({
    declarations: [
        RoomCreationComponent,
        RoomIndexComponent,
        RoomComponent,
        RoomItemComponent,
        RoomListComponent,
        RoomContainerComponent,
    ],
    exports: [RoomListComponent],
    imports: [UtilsModule, PollModule],

})
export class RoomModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: RoomModule,
            providers: [
                RoomService,
            ],
        };
    }
}
