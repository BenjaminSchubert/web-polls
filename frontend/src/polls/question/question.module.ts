import { NgModule } from "@angular/core";
import { QuestionWrapperComponent } from "./question-wrapper.component"
import { QuestionComponent } from "./question.component"
import { PollCreationComponent } from "./poll-creation.component"

@NgModule({
    declarations: [
        QuestionWrapperComponent, 
        QuestionComponent, 
        PollCreationComponent
    ],
    exports: [
        QuestionWrapperComponent, 
        QuestionComponent, 
        PollCreationComponent
    ],
    imports: [],
})
export class QuestionModule {}
