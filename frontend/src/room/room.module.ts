import { NgModule, ModuleWithProviders } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { RoomCreationComponent } from "./room-creation.component";
import { RoomIndexComponent } from "./room-index.component";
import { RoomComponent } from "./room-details.component";
import { RoomService } from "./room.service";
import { RoomItemComponent } from "./room-item.component";
import { RoomListComponent } from "./room-list.component";


@NgModule({
    declarations: [RoomCreationComponent, RoomIndexComponent, RoomComponent, RoomItemComponent, RoomListComponent],
    exports: [RoomListComponent],
    imports: [UtilsModule],

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
