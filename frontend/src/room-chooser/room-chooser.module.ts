import { NgModule, ModuleWithProviders } from "@angular/core";
import { RoomChooserComponent } from "./room-chooser.component";
import { UtilsModule } from "../utils/utils.module";
import { RoomComponent } from "./room.component";
import { RoomService } from "./room.service";


@NgModule({
    declarations: [RoomChooserComponent, RoomComponent],
    exports: [RoomChooserComponent],
    imports: [UtilsModule],
})
export class RoomChooserModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: RoomChooserModule,
            providers: [
                RoomService,
            ],
        };
    }
}
