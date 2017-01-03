import { NgModule } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { NewRoomComponent } from "./new_room.component";
import { roomRouting } from "./room.routing";


@NgModule({
    declarations: [NewRoomComponent],
    imports: [UtilsModule, roomRouting],

})
export class RoomModule {}
