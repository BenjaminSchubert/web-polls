import { NgModule } from "@angular/core";
import { RoomComponent } from "./room.component";
import { RoomChooserComponent } from "./room-chooser.component";
import { RoomService } from "./room.service";
import { UtilsModule } from "../../utils/utils.module";


@NgModule({
    declarations: [RoomComponent, RoomChooserComponent],
    exports: [RoomChooserComponent],
    imports: [UtilsModule],
    providers: [RoomService],

})
export class RoomModule {}
