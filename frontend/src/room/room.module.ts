import { NgModule, ModuleWithProviders } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { NewRoomComponent } from "./room-creation.component";
import { roomRouting } from "./room.routing";
import { RoomIndexComponent } from "./room-index.component";
import { RoomComponent } from "./room-details.component";
import { RoomService } from "./room.service";
import { RoomItemComponent } from "./room-item.component";
import { RoomListComponent } from "./room-list.component";


@NgModule({
    declarations: [NewRoomComponent, RoomIndexComponent, RoomComponent, RoomItemComponent, RoomListComponent],
    exports: [RoomListComponent],
    imports: [UtilsModule, roomRouting],

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
