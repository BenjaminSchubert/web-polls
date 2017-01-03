import { NgModule } from "@angular/core";
import { QuestionWrapperComponent } from "./question-wrapper/question-wrapper.component";
import { QuestionComponent } from "./question/question.component";
import { PollCreationComponent } from "./poll-creation/poll-creation.component";
import { QuestionCreationComponent } from "./question-creation/question-creation.component";
import { RoomIndexComponent } from "./room-index/room-index.component";


@NgModule({
    declarations: [
        QuestionWrapperComponent,
        QuestionComponent,
        QuestionCreationComponent,
        PollCreationComponent,
        RoomIndexComponent,
    ],
    exports: [
        QuestionWrapperComponent,
    ],
})
export class QuestionModule {}
