import { NgModule } from "@angular/core";
import { PollComponent } from "./poll.component";
import { UtilsModule } from "../../utils/utils.module";
import { PollChooserComponent } from "./poll-chooser.component";
import { PollService } from "./poll.service";


@NgModule({
    declarations: [PollComponent, PollChooserComponent],
    exports: [PollChooserComponent],
    imports: [UtilsModule],
    providers: [PollService],

})
export class PollModule {}
