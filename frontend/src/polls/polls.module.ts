import { NgModule } from "@angular/core";
import { PollsComponent } from "./polls.component";
import { QuestionModule } from "./question/question.module";


@NgModule({
    declarations: [PollsComponent],
    exports: [PollsComponent],
    imports: [QuestionModule],
})
export class PollsModule {}
