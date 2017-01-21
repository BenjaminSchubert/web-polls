import { NgModule, ModuleWithProviders } from "@angular/core";
import { UtilsModule } from "../utils/utils.module";
import { QuestionService } from "./question.service";
import { QuestionCreationComponent } from "./question-creation.component";


@NgModule({
    declarations: [QuestionCreationComponent],
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
