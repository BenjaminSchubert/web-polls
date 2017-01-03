import { NgModule, ModuleWithProviders } from "@angular/core";
import { PollComponent } from "./poll.component";
import { UtilsModule } from "../utils/utils.module";
import { PollChooserComponent } from "./poll-chooser.component";
import { PollService } from "./poll.service";


@NgModule({
    declarations: [PollComponent, PollChooserComponent],
    exports: [PollChooserComponent],
    imports: [UtilsModule],

})
export class PollChooserModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: PollChooserModule,
            providers: [
                PollService,
            ],
        };
    }
}
