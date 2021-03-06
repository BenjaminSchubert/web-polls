import { NgModule, ModuleWithProviders } from "@angular/core";
import { PollItemComponent } from "./poll-item.component";
import { UtilsModule } from "../utils/utils.module";
import { PollListComponent } from "./poll-list.component";
import { PollService } from "./poll.service";
import { PollCreationComponent } from "./poll-creation.component";
import { PollComponent } from "./poll-details.component";


@NgModule({
    declarations: [PollItemComponent, PollListComponent, PollCreationComponent, PollComponent],
    exports: [PollListComponent],
    imports: [UtilsModule],

})
export class PollModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: PollModule,
            providers: [
                PollService,
            ],
        };
    }
}
