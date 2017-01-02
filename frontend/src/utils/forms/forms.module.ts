import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatchDirective } from "./validators/match.validator";


@NgModule({
    declarations: [
        MatchDirective,
    ],
    exports: [
        ReactiveFormsModule,
        MatchDirective,
    ],
})
export class ExtendedFormsModule {}
