import { NgModule } from "@angular/core";
import { PollsComponent } from "./polls.component";
import { pollsRouting } from "./polls.routing";
import { QuestionModule } from "./question/question.module";


@NgModule({
    declarations: [PollsComponent],
    exports: [PollsComponent],
    imports: [QuestionModule, pollsRouting],
})
export class PollsModule {}
