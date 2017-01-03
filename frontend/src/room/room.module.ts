import { NgModule } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { NewRoomComponent } from "./new_room.component";
import { roomRouting } from "./room.routing";
import { RoomIndexComponent } from "./room-index.component";
import { RoomComponent } from "./room-details.component";


@NgModule({
    declarations: [NewRoomComponent, RoomIndexComponent, RoomComponent],
    imports: [UtilsModule, roomRouting],

})
export class RoomModule {}
