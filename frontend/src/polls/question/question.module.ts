import { NgModule } from "@angular/core";
import { QuestionWrapperComponent } from "./question-wrapper.component"
import { QuestionComponent } from "./question.component"
import { PollCreationComponent } from "./poll-creation.component"
import { QuestionCreationComponent } from "./question-creation.component"
import { RoomCreationComponent } from "./room-creation.component"

@NgModule({
    declarations: [
        QuestionWrapperComponent, 
        QuestionComponent,
        QuestionCreationComponent,
        PollCreationComponent,
        RoomCreationComponent
    ],
    exports: [
        QuestionWrapperComponent, 
        QuestionComponent, 
        QuestionCreationComponent,
        PollCreationComponent,
        RoomCreationComponent
    ],
    imports: [],
})
export class QuestionModule {}
