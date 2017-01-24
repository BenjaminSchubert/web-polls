import { NgModule, ModuleWithProviders } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { QuestionService } from "./question.service";
import { QuestionCreationComponent } from "./question-creation.component";
import { QuestionComponent } from "./question-details.component";


@NgModule({
    declarations: [QuestionCreationComponent, QuestionComponent],
    imports: [UtilsModule],

})
export class QuestionModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: QuestionModule,
            providers: [
                QuestionService,
            ],
        };
    }
}
