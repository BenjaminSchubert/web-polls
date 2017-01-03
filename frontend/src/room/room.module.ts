import { NgModule } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { NewRoomComponent } from "./new_room.component";
import { roomRouting } from "./room.routing";
import { RoomIndexComponent } from "./room-index.component";


@NgModule({
    declarations: [NewRoomComponent, RoomIndexComponent],
    imports: [UtilsModule, roomRouting],

})
export class RoomModule {}
